import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  suggestions: string[];
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  ariaRequired?: boolean;
}

export const Combobox = ({
  id,
  value,
  onChange,
  onBlur,
  suggestions,
  placeholder,
  disabled,
  invalid,
  ariaRequired,
}: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase())).slice(0, 8);

  return (
    <div ref={ref} className="relative">
      <input
        id={id}
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Delay so option click registers
          setTimeout(() => onBlur?.(), 100);
        }}
        placeholder={placeholder}
        aria-required={ariaRequired}
        aria-invalid={invalid}
        className={cn(
          "w-full h-11 pl-3 pr-9 border rounded-md text-[14px] bg-white text-dark placeholder:text-gray/70 outline-none focus:border-orange focus:shadow-focus-orange transition disabled:opacity-50 disabled:cursor-not-allowed",
          invalid ? "border-destructive" : "border-border"
        )}
      />
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray pointer-events-none"
      />
      {open && filtered.length > 0 && !disabled && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1 w-full bg-white border border-border rounded-md shadow-card-hover overflow-hidden max-h-56 overflow-y-auto"
        >
          {filtered.map((s) => (
            <li
              key={s}
              role="option"
              aria-selected={value === s}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(s);
                setOpen(false);
              }}
              className={cn(
                "px-3 py-2 text-[13px] cursor-pointer hover:bg-light",
                value === s && "text-orange font-semibold"
              )}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
