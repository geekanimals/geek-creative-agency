"use client";

/**
 * Search field for the /work filter bar. Controlled by WorkExplorer, which
 * runs the query against /api/work-search.
 */
export default function WorkSearch({ value, onChange, onClear, loading, className = "" }) {
  return (
    <div className={`wsearch ${className}`} role="search">
      <style href="wsearch" precedence="default">
        {styles}
      </style>
      <svg className="wsearch__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 11l3.25 3.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && value && onClear()}
        placeholder="Search brand, campaign, anything…"
        aria-label="Search the work"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        maxLength={100}
        className="wsearch__input"
      />
      {loading && <span className="wsearch__spin" aria-hidden />}
      {value && !loading && (
        <button type="button" onClick={onClear} className="wsearch__clear" aria-label="Clear search">
          ×
        </button>
      )}
    </div>
  );
}

const styles = `
.wsearch {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.wsearch__icon {
  position: absolute;
  left: 0.875rem;
  color: #5a5f5c;
  pointer-events: none;
}

.wsearch__input {
  width: 100%;
  height: 2.75rem;
  padding: 0 2.5rem 0 2.5rem;
  border: 1px solid #dfe2de;
  border-radius: 9999px;
  background: #ffffff;
  font-size: 16px; /* 16px stops iOS zooming into the field */
  line-height: 1.25rem;
  color: #0c0d0c;
  outline: none;
  transition: border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-appearance: none;
  appearance: none;
}

.wsearch__input::placeholder {
  color: #8a8f8c;
}

.wsearch__input::-webkit-search-cancel-button,
.wsearch__input::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
}

.wsearch__input:hover {
  border-color: #c4c8c3;
}

.wsearch__input:focus {
  border-color: #32c1df;
  box-shadow: 0 0 0 3px rgba(50, 193, 223, 0.18);
}

.wsearch__clear {
  position: absolute;
  right: 0.375rem;
  display: flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-size: 1.25rem;
  line-height: 1;
  color: #5a5f5c;
}

.wsearch__clear:hover {
  color: #0c0d0c;
  background: #f2f4f1;
}

.wsearch__spin {
  position: absolute;
  right: 0.875rem;
  width: 1rem;
  height: 1rem;
  border: 2px solid #dfe2de;
  border-top-color: #32c1df;
  border-radius: 9999px;
  animation: wsearch-spin 0.7s linear infinite;
}

@keyframes wsearch-spin {
  to { transform: rotate(360deg); }
}

@media (min-width: 1024px) {
  .wsearch__input {
    height: 2.5rem;
    font-size: 0.875rem;
  }
}
`;
