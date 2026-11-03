/**
 * The four "doors" — one place for their labels, colours, icons and pages.
 * Used by the Four Doors section (Home + Contact) and by each door's page.
 *
 *   client  → /build-my-brand   (ClientForm)
 *   creator → /creators#join    (existing Creators page + CreatorForm)
 *   career  → /careers          (CareerForm, with resume upload)
 *   vendor  → /partners         (VendorForm)
 */
export const DOORS = [
  {
    key: "client",
    href: "/build-my-brand",
    title: "Build my brand.",
    sub: "For Clients.",
    color: "#32C1DF",
    pageTitle: "Build my brand",
    pageSub: "For Clients",
    icon: (
      <path
        d="M3 7h18v12H3zM8 7V5h8v2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    key: "creator",
    href: "/creators#join",
    title: "Work with brands.",
    sub: "For Creators.",
    color: "#137C93",
    pageTitle: "Work with brands",
    pageSub: "For Creators",
    icon: (
      <>
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M4 20c0-3 2.5-5 5-5s5 2 5 5M16 6a3 3 0 0 1 0 6M18 20c0-2-1-3.5-2.5-4.3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    key: "career",
    href: "/careers",
    title: "Work at Geek.",
    sub: "For Jobs.",
    color: "#0D4A57",
    pageTitle: "Work at Geek",
    pageSub: "For Jobs",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    key: "vendor",
    href: "/partners",
    title: "Work with Geek.",
    sub: "For Vendors / Partners.",
    color: "#08252E",
    pageTitle: "Work with Geek",
    pageSub: "For Vendors / Partners",
    icon: (
      <path
        d="M8 11V8a4 4 0 0 1 8 0v3M6 11h12l-1 9H7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export const doorByKey = (key) => DOORS.find((d) => d.key === key);
