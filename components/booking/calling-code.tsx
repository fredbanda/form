"use client";

import PhoneInput from "react-phone-number-input";
// @ts-ignore
import "react-phone-number-input/style.css";


type PhoneFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function PhoneField({ value, onChange }: PhoneFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <PhoneInput
        defaultCountry="ZA"
        international
        placeholder="WhatsApp/Contact number"
        value={value}
        onChange={(val) => onChange(val ?? "")}
        className="flex h-12 w-full items-center rounded-lg border border-border bg-card px-3 text-sm"
      />
    </div>
  );
}
