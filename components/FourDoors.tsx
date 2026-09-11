"use client";

import { useState, type ReactNode } from "react";
import Band from "./ui/Band";
import Modal from "./ui/Modal";
import { ClientForm, CreatorForm, CareerForm, VendorForm } from "./forms/Forms";

type DoorKey = "client" | "creator" | "career" | "vendor";

const doors: {
  key: DoorKey;
  title: string;
  sub: string;
  color: string;
  modalTitle: string;
  modalSub: string;
  icon: ReactNode;
}[] = [
  {
    key: "client", title: "Build my brand.", sub: "For Clients.", color: "#32C1DF",
    modalTitle: "Build my brand", modalSub: "For Clients",
    icon: <path d="M3 7h18v12H3zM8 7V5h8v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    key: "creator", title: "Work with brands.", sub: "For Creators.", color: "#137C93",
    modalTitle: "Work with brands", modalSub: "For Creators",
    icon: <><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M4 20c0-3 2.5-5 5-5s5 2 5 5M16 6a3 3 0 0 1 0 6M18 20c0-2-1-3.5-2.5-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></>,
  },
  {
    key: "career", title: "Work at Geek.", sub: "For Jobs.", color: "#0D4A57",
    modalTitle: "Work at Geek", modalSub: "For Jobs",
    icon: <><rect x="3" y="7" width="18" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" /><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></>,
  },
  {
    key: "vendor", title: "Work with Geek.", sub: "For Vendors / Partners.", color: "#08252E",
    modalTitle: "Work with Geek", modalSub: "For Vendors / Partners",
    icon: <path d="M8 11V8a4 4 0 0 1 8 0v3M6 11h12l-1 9H7z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

/**
 * Optional editorial overrides (from the Contact Global). Structure — the door
 * set, keys, colours, icons, order and forms — is always code-owned; the CMS may
 * only relabel. Omitting a prop (e.g. on the Homepage) keeps the approved copy.
 */
export type FourDoorsProps = {
  eyebrow?: string;
  heading?: string;
  labels?: Partial<Record<DoorKey, { title?: string; sub?: string }>>;
};

export default function FourDoors({ eyebrow, heading, labels }: FourDoorsProps = {}) {
  const [active, setActive] = useState<DoorKey | null>(null);
  const current = doors.find((d) => d.key === active);

  return (
    <>
      <Band
        id="contact"
        label={
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-geek-cyan">{eyebrow ?? "Four doors."}</p>
            <p className="h-display mt-2 text-2xl text-ink sm:text-3xl">{heading ?? "What brings you to Geek?"}</p>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {doors.map((d) => (
            <button
              key={d.key}
              onClick={() => setActive(d.key)}
              className="group flex items-center gap-4 rounded-lg p-5 text-left text-white transition-transform duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: d.color }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>{d.icon}</svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-bold leading-tight">{labels?.[d.key]?.title ?? d.title}</span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-white/80">{labels?.[d.key]?.sub ?? d.sub}</span>
              </span>
              <span className="text-xl transition-transform group-hover:translate-x-1" aria-hidden>→</span>
            </button>
          ))}
        </div>
      </Band>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        title={current?.modalTitle ?? ""}
        subtitle={current?.modalSub}
      >
        {active === "client" && <ClientForm />}
        {active === "creator" && <CreatorForm />}
        {active === "career" && <CareerForm />}
        {active === "vendor" && <VendorForm />}
      </Modal>
    </>
  );
}
