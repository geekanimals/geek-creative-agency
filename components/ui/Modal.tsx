"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    const getFocusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

    // focus the first field/control on open
    const t = window.setTimeout(() => getFocusable()[0]?.focus(), 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      const f = getFocusable();
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      restoreRef.current?.focus?.(); // restore focus to the trigger
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative z-10 max-h-[92vh] w-full max-w-xl overflow-y-auto bg-white p-7 shadow-2xl sm:p-9"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 text-2xl leading-none text-graphite transition hover:text-ink"
            >
              ×
            </button>
            <p className="eyebrow text-geek-deep">{subtitle}</p>
            <h3 className="h-display mt-2 text-3xl text-ink">{title}</h3>
            <div className="mt-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
