import { useState } from "react";

type InputProps = {
  label: string;
  type?: string;
  placeholder: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function Input({
  label,
  type = "text",
  placeholder,
  icon,
  rightElement,
  id,
  value,
  onChange,
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold  block"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2  text-xl pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full ${icon ? "pl-12" : "pl-4"} ${
            rightElement ? "pr-12" : "pr-4"
          } py-3.5 rounded-lg border border-slate-200 bg-white outline-none transition-all placeholder:text-slate-400 text-slate-900 `}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}
export default Input;
