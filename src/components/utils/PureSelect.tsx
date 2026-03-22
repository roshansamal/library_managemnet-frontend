// components/PureSelect.tsx
import { FormControl, FormLabel } from '@chakra-ui/react';
import { type ReactNode } from 'react';

export type Option = { value: string|number; label: string };

type Props = {
  label: string;
  value?: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  children?: ReactNode;
};

export const PureSelect = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select...',
  children,
}: Props) => (
  <FormControl>                           {/* ✅ Single parent */}
    <FormLabel fontWeight="semibold" fontSize="sm">
      {label}
    </FormLabel>
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #e2e8f0',
        borderRadius: '0.375rem',
        background: '#f8fafc',  // blue.50 equivalent
        borderColor: 'gray.300',
        // _hover: { borderColor: 'blue.500' },  // Chakra-like hover
      }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {children}
  </FormControl>
);
