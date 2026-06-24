// ApiSelect.tsx
import React, { useEffect, useState } from "react";

export type Option = { value: string | number; label: string };

type ApiSelectProps = {
  name?: string;
  label?: string;
  value?: string | number;          // value from parent (auto-select)
  onChange: (value: string) => void;
  fetchOptions: () => Promise<Option[]>; // API function injected from parent
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export const ApiSelect: React.FC<ApiSelectProps> = ({
  name,
  label,
  value,
  onChange,
  fetchOptions,
  placeholder = "Select...",
  disabled = false,
  className,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchOptions();
        if (isMounted) setOptions(data);
      } catch (e) {
        if (isMounted) setOptions([]);
        // optionally log / show error
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [fetchOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      {label && <label htmlFor={name}>{label}</label>}

      <select
        id={name}
        name={name}
        disabled={disabled || loading}
        value={value ?? ""}       // auto-select if parent passes value
        onChange={handleChange}
      >
        <option value="" disabled>
          {loading ? "Loading..." : placeholder}
        </option>

        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
