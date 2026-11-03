"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Props: open (boolean), onClose (() => void), title (string),
 * subtitle? (string), children (ReactNode).
 */
export default function Modal({ open, onClose, title, subtitle, children }) {
  const dialogRef = useRef(null);
  const restoreRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement;
    document.body.style.overflow = "hidden";

    const getFocusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    // focus the first field/control on open
    const t = window.setTimeout(() => getFocusable()[0]?.focus(), 30);

    const onKey = (e) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      const f = getFocusable();
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      const active = document.activeElement;
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
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <style href="modal" precedence="default">
            {styles}
          </style>
          <div className="modal__backdrop" onClick={onClose} aria-hidden />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="modal__dialog"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
          >
            <button onClick={onClose} aria-label="Close" className="modal__close">
              ×
            </button>
            <p className="modal-eyebrow modal__subtitle">{subtitle}</p>
            <h3 className="modal-display modal__title">{title}</h3>
            <div className="modal__body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const styles = `
.modal {
  position: fixed;
  inset: 0px;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal__backdrop {
  position: absolute;
  inset: 0px;
  background-color: rgba(12, 13, 12, 0.6);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}

.modal__dialog {
  position: relative;
  z-index: 10;
  max-height: 92vh;
  width: 100%;
  max-width: 36rem;
  overflow-y: auto;
  background-color: #ffffff;
  padding: 1.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal__close {
  position: absolute;
  right: 1.25rem;
  top: 1.25rem;
  font-size: 1.5rem;
  line-height: 1;
  color: #5a5f5c;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.modal__close:hover {
  color: #0c0d0c;
}

.modal__subtitle {
  color: #137c93;
}

/* line-height comes from .modal-display (0.92), which overrode text-3xl's in the original cascade */
.modal__title {
  margin-top: 0.5rem;
  font-size: 1.875rem;
  color: #0c0d0c;
}

.modal__body {
  margin-top: 1.5rem;
}

/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.modal-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

.modal-eyebrow {
  font-family: var(--font-sans), system-ui, sans-serif;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-size: 0.72rem;
}

@media (min-width: 640px) {
  .modal {
    align-items: center;
  }

  .modal__dialog {
    padding: 2.25rem;
  }
}
`;
