type ValidInput = Date | string | number;

const isValidDate = (d: unknown) => {
  const isValidInput = d instanceof Date || typeof d === "string" || typeof d === "number";
  return isValidInput && !isNaN(new Date(d as ValidInput).getTime());
};


const toIso = (v: unknown): string => {
  const date = isValidDate(v) ? new Date(v as ValidInput) : new Date();
  return date.toISOString();
};

export default toIso;
