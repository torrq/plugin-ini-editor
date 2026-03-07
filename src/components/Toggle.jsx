export default function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full
        transition-colors duration-150 focus:outline-none
        ${checked ? 'bg-accent' : 'bg-subtle'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow
          transition-transform duration-150
          ${checked ? 'translate-x-4' : 'translate-x-[3px]'}
        `}
      />
    </button>
  )
}
