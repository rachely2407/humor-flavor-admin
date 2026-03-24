export type StepRecord = Record<string, unknown>;

export function getFlavorRefKey(sample: StepRecord) {
  if ("humor_flavor_id" in sample) return "humor_flavor_id";
  if ("flavor_id" in sample) return "flavor_id";
  if ("parent_flavor_id" in sample) return "parent_flavor_id";
  return "humor_flavor_id";
}

export function getOrderKey(sample: StepRecord) {
  if ("order_by" in sample) return "order_by";
  if ("order" in sample) return "order";
  return "order_by";
}

export function getFlavorLabel(flavor: StepRecord) {
  return (
    flavor.slug ??
    flavor.name ??
    flavor.title ??
    flavor.label ??
    flavor.description ??
    `Flavor ${String(flavor.id ?? "")}`
  );
}
