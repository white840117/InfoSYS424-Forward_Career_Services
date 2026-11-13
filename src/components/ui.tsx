import type { ReactNode } from 'react';
import type { Category } from '../types';

const BADGE_HELP: Record<Category, string> = {
  Configuration: 'Typical built-in CRM setting (team assumption)',
  Customization: 'Needs custom work or an add-on inside the CRM (team assumption)',
  Integration: 'Depends on a university system connection (team assumption)',
};

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className={`badge badge-${category.toLowerCase()}`} title={BADGE_HELP[category]}>
      {category}
    </span>
  );
}

/** A feature block: title + exactly one category badge + feature ID. */
export function Feature({
  id, title, category, description, children, actions,
}: {
  id: string;
  title: string;
  category: Category;
  description?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="card feature" aria-labelledby={`f-${id}-${title}`}>
      <header className="feature-head">
        <div>
          <div className="feature-meta">
            <CategoryBadge category={category} />
            <span className="feature-id">{id}</span>
          </div>
          <h2 id={`f-${id}-${title}`}>{title}</h2>
          {description && <p className="muted">{description}</p>}
        </div>
        {actions && <div className="feature-actions">{actions}</div>}
      </header>
      {children}
    </section>
  );
}

export function LockedPlaceholder({ what, why }: { what: string; why?: string }) {
  return (
    <div className="locked" role="note">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      <div>
        <strong>Hidden: your role has no access to {what}.</strong>
        {why && <div className="muted small">{why}</div>}
      </div>
    </div>
  );
}

export function Pill({ value }: { value: string }) {
  const cls =
    value === 'Active' || value === 'Approved' || value === 'Done' ? 'pill pill-active'
      : value === 'Dormant' || value === 'Rejected' || value === '(none)' ? 'pill pill-dormant'
        : value.startsWith('Pending') || value === 'Open' || value === 'Not connected' ? 'pill pill-pending'
          : 'pill pill-blue';
  return <span className={cls}>{value}</span>;
}

export function PageHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="page-head">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      {sub && <p className="muted lead">{sub}</p>}
    </div>
  );
}

export function ReadOnlyNote({ children }: { children: ReactNode }) {
  return <div className="note-info">{children}</div>;
}
