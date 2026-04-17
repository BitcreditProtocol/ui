import { cva } from "class-variance-authority";
import { XIcon } from "lucide-react";
import React, { forwardRef, useEffect, useId, useRef, useState } from "react";

import { AppIcon } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  icon?: React.ReactNode;
  clearable?: boolean;
  hint?: string;
  inputSize?: "sm" | "md" | "lg";
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  onClear?: () => void;
  enterKeyHint?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send";
  suffixIcon?: React.ReactNode;
  onSuffixIconClick?: () => void;
  suffixIconAriaLabel?: string;
}

const inputVariants = cva("flex items-center gap-2 rounded-[8px] border transition-all duration-200 ease-in-out", {
  variants: {
    size: {
      sm: "h-[44px] text-xs py-3",
      md: "h-[52px] text-sm py-4",
      lg: "h-[60px] text-sm py-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      required: isRequired,
      id,
      icon,
      clearable: isClearable,
      hint,
      inputSize,
      disabled: isDisabled,
      success: isSuccess,
      error: hasError,
      onClear,
      onChange,
      onBlur,
      onFocus,
      defaultValue,
      value,
      enterKeyHint = "next",
      suffixIcon,
      onSuffixIconClick,
      suffixIconAriaLabel,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [isFocused, setIsFocused] = useState(false);
    const [hasUncontrolledValue, setHasUncontrolledValue] = useState(() => {
      const initialValue = value ?? defaultValue;
      return typeof initialValue === "string" ? initialValue.length > 0 : !!initialValue;
    });

    const isControlled = value !== undefined;
    const hasValue = isControlled ? (typeof value === "string" ? value.length > 0 : !!value) : hasUncontrolledValue;

    useEffect(() => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      const checkInputValue = () => {
        const currentValue = input.value;
        const shouldHaveValue = currentValue.length > 0;
        setHasUncontrolledValue(shouldHaveValue);
      };

      const timeoutId = setTimeout(checkInputValue, 100);

      const observer = new MutationObserver(checkInputValue);
      observer.observe(input, {
        attributes: true,
        attributeFilter: ["value"],
      });

      return () => {
        clearTimeout(timeoutId);
        observer.disconnect();
      };
    }, []);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);

      if (!isControlled && inputRef.current) {
        setHasUncontrolledValue(inputRef.current.value.length > 0);
      }

      onBlur?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setHasUncontrolledValue(e.target.value.length > 0);
      }

      onChange?.(e);
    };

    const clearField = () => {
      if (inputRef.current) {
        inputRef.current.value = "";
        setHasUncontrolledValue(false);
      }

      if (isControlled) {
        onChange?.({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      }

      if (onClear) onClear();
    };

    const resolvedSuffixIconAriaLabel =
      suffixIconAriaLabel ?? (typeof label === "string" && label.trim().length > 0 ? `${label} action` : "Input action");

    const isNestedInteractiveElement = (target: EventTarget | null) =>
      target instanceof HTMLElement && target.closest("button, a, input, select, textarea, [role='button']") !== null;

    const focusInputFromContainer = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target instanceof HTMLInputElement || isNestedInteractiveElement(event.target)) {
        return;
      }
      inputRef.current?.focus();
    };

    const stopContainerFocus = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      event.stopPropagation();
    };

    return (
      <div onClick={focusInputFromContainer}>
        <div className="relative">
          <div
            className={cn(
              inputVariants({ size: inputSize }),
              "border-divider-50 bg-elevation-200 hover:border-divider-50 hover:bg-elevation-250 focus-within:border-divider-300 focus-within:bg-elevation-200",
              {
                "border-none text-[#F1EDE4] bg-divider-100 cursor-not-allowed": isDisabled,
                "border-green-500 bg-elevation-200": isSuccess,
                "border-red-500 bg-elevation-200": hasError,
              },
              className
            )}
          >
            {icon && <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex items-center">{icon}</div>}
            <input
              type={type}
              id={inputId}
              value={isControlled ? value : undefined}
              defaultValue={!isControlled ? defaultValue : undefined}
              enterKeyHint={enterKeyHint}
              className={cn("font-medium bg-transparent outline-hidden w-full px-10", icon ? "ps-[42px]" : "ps-4", {
                "pt-3": isFocused || hasValue,
              })}
              ref={(node) => {
                if (typeof ref === "function") {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
                inputRef.current = node;
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={isDisabled}
              {...props}
            />
            {isClearable && hasValue ? (
              <button
                type="button"
                aria-label="Clear input"
                onMouseDown={stopContainerFocus}
                onTouchStart={stopContainerFocus}
                onClick={clearField}
                className="absolute right-4"
              >
                <AppIcon icon={XIcon} className="text-text-300" size="md" />
              </button>
            ) : null}
            {!isClearable && suffixIcon ? (
              <button
                type="button"
                onMouseDown={stopContainerFocus}
                onTouchStart={stopContainerFocus}
                onClick={(e) => {
                  e.stopPropagation();
                  onSuffixIconClick?.();
                }}
                className="absolute right-4"
                aria-label={resolvedSuffixIconAriaLabel}
              >
                {suffixIcon}
              </button>
            ) : null}
          </div>
          <label
            htmlFor={inputId}
            className={cn(
              "absolute pointer-events-none transition-all duration-200 ease-out flex items-center text-text-300 font-medium",
              inputSize === "sm" ? "text-xs" : "text-sm",
              isFocused || hasValue
                ? cn(inputSize === "sm" ? "top-1" : "top-2", "text-xs text-text-200 font-normal")
                : "top-1/2 -translate-y-1/2",
              icon ? "left-[43px]" : "left-4",
              {
                "text-signal-success": (isFocused || hasValue) && isSuccess,
                "text-signal-error": (isFocused || hasValue) && hasError,
                "text-[#F1EDE4]": isDisabled,
              }
            )}
          >
            {label}
            {isRequired && (
              <span
                className={cn(
                  "text-[12px] ml-0",
                  !isFocused && !hasValue
                    ? "text-[#8D0002]"
                    : {
                        "text-text-200": !isSuccess && !hasError,
                        "text-signal-success": isSuccess,
                        "text-signal-error": hasError,
                      }
                )}
              >
                *
              </span>
            )}
          </label>
        </div>
        {hint ? (
          <div
            className={cn("text-xs text-text-200 mt-[2px]", {
              "text-signal-success": isSuccess,
              "text-signal-error": hasError,
            })}
          >
            {hint}
          </div>
        ) : (
          hasError && <p className="text-xs text-signal-error mt-[2px]">{hasError}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
