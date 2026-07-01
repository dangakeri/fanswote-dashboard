import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

// A clean dropdown filter: "Label: Value ▾" opening a menu of options.
// options: array of strings OR { value, label } objects.
export default function FilterSelect({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  align = "left",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const opts = options.map((o) =>
    typeof o === "object" ? o : { value: o, label: String(o) }
  );
  const current = opts.find((o) => o.value === value) || opts[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 h-9 pl-3 pr-2.5 rounded-lg text-[13px] font-medium bg-surface dark:bg-d-surface border transition-colors ${
          open
            ? "border-primary/60 ring-2 ring-primary/15"
            : "border-border dark:border-d-border hover:border-primary/40"
        }`}
      >
        {Icon && <Icon size={15} className="text-text-muted dark:text-d-text-muted shrink-0" />}
        {label && (
          <span className="text-text-muted dark:text-d-text-muted">{label}:</span>
        )}
        <span className="text-text dark:text-d-text whitespace-nowrap">{current?.label}</span>
        <ChevronDown
          size={15}
          className={`text-text-muted dark:text-d-text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-1.5 min-w-[180px] w-max max-h-72 overflow-y-auto bg-surface dark:bg-d-surface border border-border dark:border-d-border rounded-xl shadow-lg p-1.5 animate-fade-in ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {opts.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={String(o.value)}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`flex items-center justify-between gap-4 w-full px-2.5 py-2 rounded-lg text-[13px] text-left transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-text-secondary dark:text-d-text-secondary hover:bg-hover dark:hover:bg-d-hover"
                }`}
              >
                <span className="whitespace-nowrap">{o.label}</span>
                {active && <Check size={15} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
