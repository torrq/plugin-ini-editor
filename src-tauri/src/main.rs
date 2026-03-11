#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};
use std::fs;
use tauri::api::dialog::blocking::FileDialogBuilder;
use winreg::enums::*;
use winreg::RegKey;

#[derive(Serialize, Deserialize, Clone, Debug)]
struct IniPair {
    key: String,
    value: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct IniSection {
    name: String,
    header: String,
    pairs: Vec<IniPair>,
    /// Original lines in order (comments, blanks, key names).
    /// Comments/blanks start with ";" or are empty.
    /// Key references are plain key names (no "=").
    raw_lines: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct IniConfig {
    sections: Vec<IniSection>,
}

fn parse_ini(content: &str) -> IniConfig {
    let mut sections: Vec<IniSection> = Vec::new();
    let mut current: Option<IniSection> = None;

    for line in content.lines() {
        let trimmed = line.trim();

        // Section header
        if trimmed.starts_with('[') && trimmed.ends_with(']') {
            if let Some(sec) = current.take() {
                sections.push(sec);
            }
            let name = trimmed[1..trimmed.len() - 1].trim().to_string();
            current = Some(IniSection {
                name,
                header: trimmed.to_string(),
                pairs: Vec::new(),
                raw_lines: Vec::new(),
            });
            continue;
        }

        if let Some(ref mut sec) = current {
            if trimmed.is_empty() || trimmed.starts_with(';') {
                // Preserve comment and blank lines verbatim
                sec.raw_lines.push(line.to_string());
            } else if let Some(eq) = trimmed.find('=') {
                let key = trimmed[..eq].trim().to_string();
                let rest = trimmed[eq + 1..].trim();
                // Value is everything before an inline comment
                let value = match rest.find(';') {
                    Some(i) => rest[..i].trim().to_string(),
                    None => rest.to_string(),
                };
                if !key.is_empty() {
                    sec.pairs.push(IniPair { key, value });
                    // Store the FULL original line so we can recover the inline comment on render
                    sec.raw_lines.push(line.to_string());
                }
            }
        }
    }
    if let Some(sec) = current {
        sections.push(sec);
    }
    IniConfig { sections }
}

fn render_ini(config: &IniConfig) -> String {
    let mut out = String::new();
    for section in &config.sections {
        out.push_str(&format!("{}\n", section.header));

        let mut emitted_keys: std::collections::HashSet<String> = std::collections::HashSet::new();

        for raw in &section.raw_lines {
            let trimmed = raw.trim();
            if trimmed.is_empty() || trimmed.starts_with(';') {
                // Comment or blank — emit verbatim
                out.push_str(&format!("{}\n", raw));
            } else if let Some(eq) = trimmed.find('=') {
                // Key=value line — emit with updated value, preserving any inline comment
                let key = trimmed[..eq].trim();
                let rest = trimmed[eq + 1..].trim();
                // Extract the inline comment if present (e.g. "; Default: Arial")
                let inline_comment = match rest.find(';') {
                    Some(i) => Some(rest[i..].trim().to_string()),
                    None => None,
                };
                if let Some(pair) = section.pairs.iter().find(|p| p.key == key) {
                    match inline_comment {
                        Some(comment) => out.push_str(&format!("{} = {} {}\n", pair.key, pair.value, comment)),
                        None          => out.push_str(&format!("{} = {}\n", pair.key, pair.value)),
                    }
                    emitted_keys.insert(key.to_string());
                }
            }
        }

        // Append any new keys added by the user (e.g. extra turbo slots)
        let mut appended_new = false;
        for pair in &section.pairs {
            if !emitted_keys.contains(&pair.key) {
                out.push_str(&format!("{} = {}\n", pair.key, pair.value));
                appended_new = true;
            }
        }

        // Add a trailing blank line between sections.
        // If we appended new keys, the last thing written was a key line — always add \n.
        // Otherwise defer to whether raw_lines already ended with a blank.
        let already_blank = !appended_new &&
            section.raw_lines.last().map(|l| l.trim().is_empty()).unwrap_or(false);
        if !already_blank {
            out.push('\n');
        }
    }
    out
}

#[tauri::command]
fn get_system_fonts() -> Vec<String> {
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let fonts_key = hklm.open_subkey(
        r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts"
    );

    match fonts_key {
        Ok(key) => {
            let mut families: std::collections::HashSet<String> = std::collections::HashSet::new();
            for (name, _value) in key.enum_values().filter_map(|x| x.ok()) {
                // Registry names look like "Arial (TrueType)" or "Segoe UI Bold (TrueType)"
                // Strip the parenthetical suffix to get the family name
                let family = if let Some(i) = name.find('(') {
                    name[..i].trim().to_string()
                } else {
                    name.trim().to_string()
                };
                // Further strip weight/style suffixes like "Bold", "Italic", "Bold Italic"
                // by taking only up to the first known style word if present
                let base = strip_style_suffix(&family);
                if !base.is_empty() {
                    families.insert(base);
                }
            }
            let mut result: Vec<String> = families.into_iter().collect();
            result.sort();
            result
        }
        Err(_) => {
            // Fallback if registry read fails
            vec![
                "Arial".into(), "Calibri".into(), "Consolas".into(),
                "Courier New".into(), "Georgia".into(), "Lucida Console".into(),
                "Segoe UI".into(), "Tahoma".into(), "Times New Roman".into(),
                "Trebuchet MS".into(), "Verdana".into(),
            ]
        }
    }
}

fn strip_style_suffix(name: &str) -> String {
    // Some registry entries include style in the name e.g. "Arial Bold"
    // We want just the family root. Try known suffixes.
    const SUFFIXES: &[&str] = &[
        " Bold Italic", " Bold", " Italic", " Light Italic", " Light",
        " Regular", " Medium", " Semibold", " Black", " Thin",
        " ExtraLight", " ExtraBold", " SemiBold",
    ];
    let mut s = name.to_string();
    for suffix in SUFFIXES {
        if s.ends_with(suffix) {
            s = s[..s.len() - suffix.len()].to_string();
            break;
        }
    }
    s
}

#[tauri::command]
fn open_config() -> Result<Option<(String, IniConfig)>, String> {
    let path = FileDialogBuilder::new()
        .set_title("Open plugin.ini")
        .add_filter("INI Config", &["ini"])
        .pick_file();

    match path {
        Some(p) => {
            let content = fs::read_to_string(&p).map_err(|e| e.to_string())?;
            let config = parse_ini(&content);
            Ok(Some((p.to_string_lossy().to_string(), config)))
        }
        None => Ok(None),
    }
}

#[tauri::command]
fn save_config(path: String, config: IniConfig) -> Result<(), String> {
    let content = render_ini(&config);
    fs::write(&path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_config_as(config: IniConfig) -> Result<Option<String>, String> {
    let path = FileDialogBuilder::new()
        .set_title("Save plugin.ini")
        .add_filter("INI Config", &["ini"])
        .set_file_name("plugin.ini")
        .save_file();

    match path {
        Some(p) => {
            let content = render_ini(&config);
            fs::write(&p, &content).map_err(|e| e.to_string())?;
            Ok(Some(p.to_string_lossy().to_string()))
        }
        None => Ok(None),
    }
}

#[tauri::command]
fn get_defaults() -> Result<IniConfig, String> {
    let exe_path = std::env::current_exe().map_err(|e| e.to_string())?;
    let dir = exe_path
        .parent()
        .ok_or_else(|| "Cannot determine exe directory".to_string())?;
    let defaults_path = dir.join("plugin.defaults");

    if !defaults_path.exists() {
        return Err(format!(
            "plugin.defaults was not found in:\n{}\n\nThis file should be shipped alongside the editor.",
            dir.display()
        ));
    }

    let content = fs::read_to_string(&defaults_path).map_err(|e| e.to_string())?;
    Ok(parse_ini(&content))
}

#[tauri::command]
fn auto_load_config() -> Result<(String, IniConfig), String> {
    let exe_path = std::env::current_exe().map_err(|e| e.to_string())?;
    let dir = exe_path
        .parent()
        .ok_or_else(|| "Cannot determine exe directory".to_string())?;
    let ini_path = dir.join("plugin.ini");

    if !ini_path.exists() {
        return Err(format!(
            "plugin.ini was not found in:\n{}\n\nPlace plugin.ini in the same folder as this exe.",
            dir.display()
        ));
    }

    let content = fs::read_to_string(&ini_path).map_err(|e| e.to_string())?;
    let config = parse_ini(&content);
    Ok((ini_path.to_string_lossy().to_string(), config))
}

#[tauri::command]
fn pick_image_file() -> Result<Option<String>, String> {
    let path = FileDialogBuilder::new()
        .set_title("Select Image")
        .add_filter("Bitmap Images", &["bmp"])
        .add_filter("All Files", &["*"])
        .pick_file();

    Ok(path.map(|p| {
        p.file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string()
    }))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_defaults,
            get_system_fonts,
            auto_load_config,
            open_config,
            save_config,
            save_config_as,
            pick_image_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
