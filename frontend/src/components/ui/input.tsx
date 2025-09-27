import * as React from "react";
import { cn } from "@/lib/utils";

function normalizeDate(value: string) {
  if (!value) return "";

  // Already ISO (yyyy-mm-dd)
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // mm/dd/yyyy → yyyy-mm-dd
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [mm, dd, yyyy] = value.split("/");
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

  return value; // fallback
}

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, value, onChange, onPaste, ...props }, ref) => {
    let normalizedValue = value;

    if (type === "date" && typeof value === "string") {
      normalizedValue = normalizeDate(value);
    }

    // wrap change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "date") {
        const newValue = normalizeDate(e.target.value);
        e.target.value = newValue; // force normalized value
        onChange?.(e);
      } else {
        onChange?.(e);
      }
    };

    // handle paste
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (type === "date") {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text");
        const normalized = normalizeDate(pasted.trim());

        if (normalized) {
          const input = e.target as HTMLInputElement;
          input.value = normalized;

          // fire synthetic event so formData updates
          const event = new Event("input", { bubbles: true });
          input.dispatchEvent(event);
        }
      }
      onPaste?.(e);
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        value={normalizedValue}
        onChange={handleChange}
        onPaste={handlePaste}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
