"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  type AdminFieldType,
  type AdminResourceConfig,
} from "@/lib/adminResources";

type Row = Record<string, unknown>;

function formatCellValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function getInitialDraft(config: AdminResourceConfig) {
  const draft: Record<string, string | number | boolean> = {};

  for (const field of config.editableFields) {
    draft[field] = config.fieldTypes[field] === "boolean" ? false : "";
  }

  return draft;
}

function getFieldInput(
  field: string,
  value: string | number | boolean,
  fieldType: AdminFieldType | undefined,
  onChange: (nextValue: string | number | boolean) => void
) {
  if (fieldType === "boolean") {
    return (
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>{field}</span>
      </label>
    );
  }

  if (fieldType === "textarea") {
    return (
      <textarea
        className="textarea"
        value={String(value)}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <input
      className="input"
      type={fieldType === "number" ? "number" : fieldType === "email" ? "email" : "text"}
      value={String(value)}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function AdminResourcePage({
  config,
  initialRows,
}: {
  config: AdminResourceConfig;
  initialRows: Row[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | number | null>(null);
  const [draft, setDraft] = useState<Record<string, string | number | boolean>>(
    getInitialDraft(config)
  );

  async function getAccessToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token ?? null;
  }

  async function refreshRows() {
    setLoading(true);

    const response = await fetch(`/api/admin/resources/${config.slug}`);
    const result = await response.json();

    setLoading(false);

    if (!response.ok) {
      alert(result.error || `Failed to load ${config.title.toLowerCase()}.`);
      return;
    }

    setRows(result.rows ?? []);
    router.refresh();
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setCreating(true);

    const token = await getAccessToken();

    if (!token) {
      setCreating(false);
      alert("You must be logged in.");
      return;
    }

    const response = await fetch(`/api/admin/resources/${config.slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(draft),
    });

    const result = await response.json();
    setCreating(false);

    if (!response.ok) {
      alert(result.error || `Failed to create ${config.title.toLowerCase()}.`);
      return;
    }

    setDraft(getInitialDraft(config));
    await refreshRows();
  }

  async function handleUpdate(rowId: string | number) {
    const token = await getAccessToken();

    if (!token) {
      alert("You must be logged in.");
      return;
    }

    const row = rows.find((item) => String(item.id) === String(rowId));

    if (!row) return;

    const payload: Record<string, unknown> = {};
    for (const field of config.editableFields) {
      payload[field] = row[field];
    }

    const response = await fetch(`/api/admin/resources/${config.slug}/${rowId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || `Failed to update ${config.title.toLowerCase()}.`);
      return;
    }

    setEditingRowId(null);
    await refreshRows();
  }

  async function handleDelete(rowId: string | number) {
    const confirmed = window.confirm(`Delete this ${config.title.slice(0, -1).toLowerCase()}?`);
    if (!confirmed) return;

    const token = await getAccessToken();

    if (!token) {
      alert("You must be logged in.");
      return;
    }

    const response = await fetch(`/api/admin/resources/${config.slug}/${rowId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      alert(result.error || `Failed to delete ${config.title.toLowerCase()}.`);
      return;
    }

    await refreshRows();
  }

  return (
    <div className="admin-stack">
      {config.mode === "crud" ? (
        <section className="pretty-panel">
          <div className="section-head">
            <div>
              <h2 className="section-title">Create {config.title.slice(0, -1)}</h2>
              <p className="section-subtitle">{config.description}</p>
            </div>

            <button className="btn" type="button" onClick={refreshRows} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <form onSubmit={handleCreate}>
            <div className="grid-2">
              {config.editableFields.map((field) => (
                <div className="form-group" key={field}>
                  {config.fieldTypes[field] === "boolean" ? null : (
                    <label className="label">{field.replaceAll("_", " ")}</label>
                  )}
                  {getFieldInput(field, draft[field], config.fieldTypes[field], (nextValue) =>
                    setDraft((current) => ({ ...current, [field]: nextValue }))
                  )}
                </div>
              ))}
            </div>

            <div className="action-row">
              <button className="btn btn-primary" disabled={creating}>
                {creating ? "Creating..." : `Create ${config.title.slice(0, -1)}`}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="pretty-panel">
        <div className="section-head">
          <div>
            <h2 className="section-title">{config.title}</h2>
            <p className="section-subtitle">
              Showing {rows.length} recent rows from <code>{config.table}</code>.
            </p>
          </div>

          <button className="btn" type="button" onClick={refreshRows} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {config.columns.map((column) => (
                  <th key={column}>{column.replaceAll("_", " ")}</th>
                ))}
                {config.mode === "crud" ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const rowId = row.id as string | number;
                const isEditing = editingRowId !== null && String(editingRowId) === String(rowId);

                return (
                  <tr key={String(rowId)}>
                    {config.columns.map((column) => (
                      <td key={column}>
                        {isEditing && config.editableFields.includes(column)
                          ? getFieldInput(
                              column,
                              (row[column] as string | number | boolean | null) ?? "",
                              config.fieldTypes[column],
                              (nextValue) =>
                                setRows((current) =>
                                  current.map((item) =>
                                    String(item.id) === String(rowId)
                                      ? { ...item, [column]: nextValue }
                                      : item
                                  )
                                )
                            )
                          : formatCellValue(row[column])}
                      </td>
                    ))}
                    {config.mode === "crud" ? (
                      <td>
                        <div className="row-actions">
                          {isEditing ? (
                            <>
                              <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => void handleUpdate(rowId)}
                              >
                                Save
                              </button>
                              <button
                                className="btn"
                                type="button"
                                onClick={() => {
                                  setEditingRowId(null);
                                  void refreshRows();
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn"
                                type="button"
                                onClick={() => setEditingRowId(rowId)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => void handleDelete(rowId)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
