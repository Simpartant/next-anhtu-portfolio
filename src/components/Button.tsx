import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "ghost"
    | "link"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "neutral";
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
}: ButtonProps) {
  const classes = clsx(
    "btn",
    `btn-${variant}`,
    "rounded-none",
    "text-base",
    "font-normal",
    "py-8",
    "px-15",
    "text-black",
    variant === "primary" && "bg-white",
    disabled && "btn-disabled",
    className
  );

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
