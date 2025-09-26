import React from 'react';
import { Input } from './input';
import { formatDateToUS, formatDateFromUS } from '@/utils/dateFormat';

interface DateInputProps extends Omit<React.ComponentProps<typeof Input>, 'type' | 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export const DateInput: React.FC<DateInputProps> = ({ value, onChange, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Convert MM/DD/YYYY to YYYY-MM-DD for storage
    const isoDate = formatDateFromUS(inputValue);
    onChange(isoDate);
  };

  // Display MM/DD/YYYY format
  const displayValue = formatDateToUS(value);

  return (
    <Input
      {...props}
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder="MM/DD/YYYY"
      pattern="\d{2}/\d{2}/\d{4}"
      onBlur={(e) => {
        // Validate and format on blur
        const input = e.target.value;
        if (input && !/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
          // Try to parse partial dates
          const cleaned = input.replace(/\D/g, '');
          if (cleaned.length >= 8) {
            const month = cleaned.substring(0, 2);
            const day = cleaned.substring(2, 4);
            const year = cleaned.substring(4, 8);
            const formatted = `${month}/${day}/${year}`;
            const isoDate = formatDateFromUS(formatted);
            onChange(isoDate);
          }
        }
      }}
    />
  );
};