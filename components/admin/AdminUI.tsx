"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { AdminIcon } from "./AdminIcon";

export function Badge({ children }: { children: string }) {
  const variant = children.toLowerCase().replaceAll(" ", "-");
  return <span className={`admin-badge admin-badge--${variant}`}><span aria-hidden="true" />{children}</span>;
}

export function Feedback({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return <div className={`admin-feedback ${error ? "admin-feedback--error" : ""}`} role={error ? "alert" : "status"}>{children}</div>;
}

export function PageLoading({ title }: { title: string }) {
  return (
    <div className="admin-page-heading">
      <div>
        <h1>{title}</h1>
        <p className="admin-loading" role="status">Loading records...</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return <div className="admin-empty"><strong>{title}</strong><p>{children}</p></div>;
}

export function Field({
  id,
  label,
  error,
  hint,
  optional = false,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}{optional && <span className="admin-optional"> Optional</span>}</label>
      {children}
      {hint && <p className="admin-field-hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="admin-field-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

export function Dialog({
  title,
  description,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className={`admin-dialog ${wide ? "admin-dialog--wide" : ""}`}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !event.defaultPrevented) {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <div className="admin-dialog-header">
        <div>
          <h2 id={titleId}>{title}</h2>
          {description && <p id={descriptionId}>{description}</p>}
        </div>
        <button type="button" className="admin-icon-button" aria-label="Close dialog" onClick={onClose}>
          <AdminIcon name="close" size={18} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
