"use client";

import { useMemo, useState } from "react";
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

export function StepCreator({
  flavors,
  stepTypes,
  models,
  inputTypes,
  outputTypes,
}: {
  flavors: FlavorOption[];
  stepTypes: StepTypeOption[];
  models: ModelOption[];
  inputTypes: InputTypeOption[];
  outputTypes: OutputTypeOption[];
}) {
  const router = useRouter();

  const [humorFlavorId, setHumorFlavorId] = useState<number>(flavors[0]?.id ?? 0);
  const [orderBy, setOrderBy] = useState<number>(1);
  const [llmTemperature, setLlmTemperature] = useState<string>("0.7");
  const [llmInputTypeId, setLlmInputTypeId] = useState<number>(inputTypes[0]?.id ?? 0);
  const [llmOutputTypeId, setLlmOutputTypeId] = useState<number>(outputTypes[0]?.id ?? 0);
  const [llmModelId, setLlmModelId] = useState<number>(models[0]?.id ?? 0);
  const [humorFlavorStepTypeId, setHumorFlavorStepTypeId] = useState<number>(stepTypes[0]?.id ?? 0);
  const [llmSystemPrompt, setLlmSystemPrompt] = useState("");
  const [llmUserPrompt, setLlmUserPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const disabled = useMemo(() => {
    return (
      !humorFlavorId ||
      !llmInputTypeId ||
      !llmOutputTypeId ||
      !llmModelId ||
      !humorFlavorStepTypeId
    );
  }, [
    humorFlavorId,
    llmInputTypeId,
    llmOutputTypeId,
    llmModelId,
    humorFlavorStepTypeId,
  ]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("humor_flavor_steps").insert({
      humor_flavor_id: humorFlavorId,
      order_by: orderBy,
      llm_temperature: llmTemperature === "" ? null : Number(llmTemperature),
      llm_input_type_id: llmInputTypeId,
      llm_output_type_id: llmOutputTypeId,
      llm_model_id: llmModelId,
      humor_flavor_step_type_id: humorFlavorStepTypeId,
      llm_system_prompt: llmSystemPrompt,
      llm_user_prompt: llmUserPrompt,
      description: description || null,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Humor flavor step created successfully");
    router.refresh();
  }

  return (
    <form onSubmit={handleCreate} className="card" style={{ padding: 24 }}>
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
            value={orderBy}
            onChange={(e) => setOrderBy(Number(e.target.value))}
            min={1}
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

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <button className="btn btn-primary" disabled={loading || disabled}>
          {loading ? "Creating..." : "Create step"}
        </button>
      </div>
    </form>
  );
}