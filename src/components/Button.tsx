import React from "react";
import Link from "next/link";
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
  href,
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
    "text-black",
    "font-normal",
    "py-8",
    "px-15",
    disabled && "btn-disabled",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

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
