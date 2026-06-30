"use client";

import { useId, useRef } from "react";

import styles from "./OtpInput.module.css";

const OTP_LENGTH = 6;
const OTP_SLOTS = ["d0", "d1", "d2", "d3", "d4", "d5"] as const;

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, onComplete, disabled }: OtpInputProps) {
  const labelId = useId();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? "");

  function commitValue(next: string) {
    onChange(next);

    if (next.length === OTP_LENGTH) {
      onComplete?.(next);
    }
  }

  function updateAt(index: number, nextChar: string) {
    const chars = digits.slice();
    chars[index] = nextChar;
    commitValue(chars.join("").slice(0, OTP_LENGTH));
  }

  function handleChange(index: number, nextValue: string) {
    const digit = nextValue.replace(/\D/g, "").slice(-1);
    updateAt(index, digit);

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, key: string) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    commitValue(pasted);

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  }

  return (
    <div>
      <span id={labelId} className={styles.srOnly}>
        6-digit verification code
      </span>
      <div className={styles.otpRow} role="group" aria-labelledby={labelId}>
        {OTP_SLOTS.map((slotId, index) => (
          <input
            key={slotId}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            className={styles.digit}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digits[index]}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e.key)}
            onPaste={handlePaste}
          />
        ))}
      </div>
    </div>
  );
}
