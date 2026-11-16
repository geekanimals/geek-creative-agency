"use client";

/**
 * "Apply" on a role card: fills the form's Position field with the role,
 * scrolls to the application form and focuses the first field.
 */
export default function ApplyButton({ role, className, children }) {
  const onClick = (e) => {
    const form = document.getElementById("apply");
    if (!form) return;
    e.preventDefault();
    const position = form.querySelector('input[name="position"]');
    if (position) position.value = role;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    const first = form.querySelector('input[name="name"]');
    if (first) setTimeout(() => first.focus({ preventScroll: true }), 450);
  };
  return (
    <a href="#apply" className={className} onClick={onClick}>
      {children}
    </a>
  );
}
