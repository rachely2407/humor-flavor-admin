"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type FlavorOption = {
  id: number;
  slug: string | null;
};

type StepTypeOption = {
  id: number;
};

type ModelOption = {
  id: number;
};

type InputTypeOption = {
  id: number;
};

type OutputTypeOption = {
  id: number;
};

export function StepEditor({
  step,
  flavors,
  stepTypes,
  models,
  inputTypes,
  outputTypes,
}: {
  step: {
    id: number;
    humor_flavor_id?: number;
    flavor_id?: number;
    parent_flavor_id?: number;
    order_by?: number;
    order?: number;
    llm_temperature: number | null;
    llm_input_type_id: number;
    llm_output_type_id: number;
    llm_model_id: number;
    humor_flavor_step_type_id: number;
    llm_system_prompt: string | null;
    llm_user_prompt: string | null;
    description: string | null;
  };
  flavors: FlavorOption[];
  stepTypes: StepTypeOption[];
  models: ModelOption[];
  inputTypes: InputTypeOption[];
  outputTypes: OutputTypeOption[];
}) {
  const router = useRouter();
  const initialFlavorId =
    step.humor_flavor_id ?? step.flavor_id ?? step.parent_flavor_id ?? 0;
  const initialOrder = step.order_by ?? step.order ?? 1;

  const [humorFlavorId, setHumorFlavorId] = useState<number>(initialFlavorId);
  const [orderBy, setOrderBy] = useState<number>(initialOrder);
  const [llmTemperature, setLlmTemperature] = useState<string>(
    step.llm_temperature?.toString() ?? ""
  );
  const [llmInputTypeId, setLlmInputTypeId] = useState<number>(step.llm_input_type_id);
  const [llmOutputTypeId, setLlmOutputTypeId] = useState<number>(step.llm_output_type_id);
  const [llmModelId, setLlmModelId] = useState<number>(step.llm_model_id);
  const [humorFlavorStepTypeId, setHumorFlavorStepTypeId] = useState<number>(
    step.humor_flavor_step_type_id
  );
  const [llmSystemPrompt, setLlmSystemPrompt] = useState(step.llm_system_prompt ?? "");
  const [llmUserPrompt, setLlmUserPrompt] = useState(step.llm_user_prompt ?? "");
  const [description, setDescription] = useState(step.description ?? "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function getAccessToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token ?? null;
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const token = await getAccessToken();

    if (!token) {
      setLoading(false);
      alert("You must be logged in.");
      return;
    }

    const response = await fetch(`/api/admin/steps/${step.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        humor_flavor_id: humorFlavorId,
        order_by: orderBy,
        llm_temperature: llmTemperature,
        llm_input_type_id: llmInputTypeId,
        llm_output_type_id: llmOutputTypeId,
        llm_model_id: llmModelId,
        humor_flavor_step_type_id: humorFlavorStepTypeId,
        llm_system_prompt: llmSystemPrompt,
        llm_user_prompt: llmUserPrompt,
        description,
      }),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      alert(result.error || "Failed to update humor flavor step.");
      return;
    }

    alert("Humor flavor step updated successfully");
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this humor flavor step?"
    );

    if (!confirmed) return;

    setDeleting(true);

    const token = await getAccessToken();

    if (!token) {
      setDeleting(false);
      alert("You must be logged in.");
      return;
    }

    const response = await fetch(`/api/admin/steps/${step.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json().catch(() => ({}));
    setDeleting(false);

    if (!response.ok) {
      alert(result.error || "Failed to delete humor flavor step.");
      return;
    }

    alert("Humor flavor step deleted successfully");
    router.push("/admin/steps");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="card"
      style={{ padding: 24, maxWidth: 900 }}
    >
      <div className="grid-2">
        <div>
          <label className="label">Humor flavor</label>
          <select
            className="select"
            value={humorFlavorId}
            onChange={(e) => setHumorFlavorId(Number(e.target.value))}
          >
            {flavors.map((flavor) => (
              <option key={flavor.id} value={flavor.id}>
                {flavor.id} — {flavor.slug ?? "(no slug)"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Order</label>
          <input
            className="input"
            type="number"
            min={1}
            value={orderBy}
            onChange={(e) => setOrderBy(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="label">Temperature</label>
          <input
            className="input"
            type="number"
            step="0.1"
            value={llmTemperature}
            onChange={(e) => setLlmTemperature(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Step type ID</label>
          <select
            className="select"
            value={humorFlavorStepTypeId}
            onChange={(e) => setHumorFlavorStepTypeId(Number(e.target.value))}
          >
            {stepTypes.map((row) => (
              <option key={row.id} value={row.id}>
                {row.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Model ID</label>
          <select
            className="select"
            value={llmModelId}
            onChange={(e) => setLlmModelId(Number(e.target.value))}
          >
            {models.map((row) => (
              <option key={row.id} value={row.id}>
                {row.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Input type ID</label>
          <select
            className="select"
            value={llmInputTypeId}
            onChange={(e) => setLlmInputTypeId(Number(e.target.value))}
          >
            {inputTypes.map((row) => (
              <option key={row.id} value={row.id}>
                {row.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Output type ID</label>
          <select
            className="select"
            value={llmOutputTypeId}
            onChange={(e) => setLlmOutputTypeId(Number(e.target.value))}
          >
            {outputTypes.map((row) => (
              <option key={row.id} value={row.id}>
                {row.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <label className="label">System prompt</label>
        <textarea
          className="textarea"
          value={llmSystemPrompt}
          onChange={(e) => setLlmSystemPrompt(e.target.value)}
          required
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <label className="label">User prompt</label>
        <textarea
          className="textarea"
          value={llmUserPrompt}
          onChange={(e) => setLlmUserPrompt(e.target.value)}
          required
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <label className="label">Description</label>
        <input
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => router.push("/admin/steps")}
        >
          Back
        </button>

        <button
          type="button"
          className="btn btn-danger"
          disabled={deleting}
          onClick={handleDelete}
        >
          {deleting ? "Deleting..." : "Delete step"}
        </button>
      </div>
    </form>
  );
}
