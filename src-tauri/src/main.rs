#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};
use std::fs;
use tauri::api::dialog::blocking::FileDialogBuilder;

#[derive(Serialize, Deserialize, Clone, Debug)]
struct IniPair {
    key: String,
    value: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct IniSection {
    name: String,
    header: String, // preserved original header, e.g. "[ Turbo Hotkeys ]"
    pairs: Vec<IniPair>,
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
        if trimmed.is_empty() || trimmed.starts_with(';') {
            continue;
        }
        if trimmed.starts_with('[') && trimmed.ends_with(']') {
            if let Some(sec) = current.take() {
                sections.push(sec);
            }
            let name = trimmed[1..trimmed.len() - 1].trim().to_string();
            current = Some(IniSection {
                name,
                header: trimmed.to_string(),
                pairs: Vec::new(),
            });
            continue;
        }
        if let Some(ref mut sec) = current {
            if let Some(eq) = trimmed.find('=') {
                let key = trimmed[..eq].trim().to_string();
                let rest = trimmed[eq + 1..].trim();
                let value = match rest.find(';') {
                    Some(i) => rest[..i].trim().to_string(),
                    None => rest.to_string(),
                };
                if !key.is_empty() {
                    sec.pairs.push(IniPair { key, value });
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
        for pair in &section.pairs {
            out.push_str(&format!("{} = {}\n", pair.key, pair.value));
        }
        out.push('\n');
    }
    out
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
            open_config,
            save_config,
            save_config_as,
            pick_image_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
