import isValidDate, {ValidInput}  from "@/utils/is-valid-date";

const toIso = (v: unknown): string => {
  const date = isValidDate(v) ? new Date(v as ValidInput) : new Date();
  return date.toISOString();
};

export default toIso;
