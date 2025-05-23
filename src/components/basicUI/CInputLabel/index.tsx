import React, { useState, useEffect } from "react";
import { Input, InputProps } from "antd";
import "./index.scss";

interface InputWithLabelProps extends InputProps {
  label: string;
  defaultValue?: string;
  value?: string; // Thêm thuộc tính value
  disabled?: boolean; // Check if disabled to handle that case
  type?: "text" | "number";
}

const CInputLabel: React.FC<InputWithLabelProps> = ({
  label,
  defaultValue,
  value,
  onChange,
  disabled,
  type = "text",
  ...inputProps
}) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [inputValue, setInputValue] = useState<string | undefined>(
    value || defaultValue
  );

  useEffect(() => {
    // Cập nhật inputValue khi value thay đổi
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [defaultValue, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (type === "number") {
      value = value.replace(/[^0-9]/g, "");
    }
    setInputValue(value);
    if (onChange) {
      onChange({
        ...e,
        target: { ...e.target, value },
      });
    }
  };

  return (
    <div className="input-with-label">
      <div className="input-wrapper">
        <Input
          {...inputProps}
          value={inputValue}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          className="input-field"
        />
        <div
          className={`label
    ${
      hasFocus ||
      (inputValue !== undefined && inputValue !== "") ||
      (defaultValue !== undefined && defaultValue !== "") ||
      disabled
        ? "active"
        : ""
    }
    ${disabled ? "disabled" : ""}`}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export default CInputLabel;
