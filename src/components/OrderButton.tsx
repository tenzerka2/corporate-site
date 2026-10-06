"use client";
import { useRef, useState } from "react";
import { OrderDialog } from "./OrderDialog";

/** Any button that opens the order form. Focus returns to it on close. */
export function OrderButton({
  label,
  summary,
  className = "button",
  children,
}: {
  label: string;
  summary?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={button} type="button" className={className} onClick={() => setOpen(true)}>
        {children}
        {label}
      </button>
      <OrderDialog
        open={open}
        summary={summary}
        onClose={() => {
          setOpen(false);
          button.current?.focus();
        }}
      />
    </>
  );
}
