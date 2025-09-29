import * as React from "react";
import { cn } from "@/lib/utils";

function normalizeToISO(value: string) {
  if (!value) return "";

  // Already ISO (yyyy-mm-dd)
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // mm/dd/yyyy → yyyy-mm-dd
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
    const [mm, dd, yyyy] = value.split("/");
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

  return value; // fallback
}

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, value, onChange, onPaste, ...props }, ref) => {
    // For date inputs, ensure value is in ISO format for the input element
    const inputValue = React.useMemo(() => {
      if (type === "date" && typeof value === "string") {
        return normalizeToISO(value);
      }
      return value;
    }, [type, value]);

    // Handle change events
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "date") {
        // Date inputs already provide ISO format (yyyy-mm-dd)
        onChange?.(e);
      } else {
        onChange?.(e);
      }
    };

    // Handle paste events for date inputs
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (type === "date") {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").trim();
        const normalizedValue = normalizeToISO(pasted);

        if (normalizedValue && /^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)) {
          const input = e.target as HTMLInputElement;
          input.value = normalizedValue;

          // Trigger change event
          if (onChange) {
            const syntheticEvent = {
              ...e,
              target: {
                ...e.target,
                value: normalizedValue
              }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
          }
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
        value={inputValue}
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
