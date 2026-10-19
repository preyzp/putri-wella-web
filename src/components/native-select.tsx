import type { ComponentPropsWithoutRef } from 'react';
import { ChevronDown } from 'lucide-react';

type NativeSelectProps = ComponentPropsWithoutRef<'select'> & { placeholderShown?: boolean };

// Retains native labeling, keyboard behavior and the browser/OS option picker.
export function NativeSelect({ className = '', placeholderShown = false, ...props }: NativeSelectProps) {
  return <span className="public-select-wrapper">
    <select {...props} className={`public-select ${className}`} data-placeholder={placeholderShown || undefined} />
    <ChevronDown className="public-select-chevron" size={18} aria-hidden="true" />
  </span>;
}
