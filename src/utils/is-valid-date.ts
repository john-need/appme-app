export type ValidInput = Date | string | number;

const isValidDate = (d: unknown) => {
  const isValidInput = d instanceof Date || typeof d === "string" || typeof d === "number";
  return isValidInput && !isNaN(new Date(d as ValidInput).getTime());
};


export default isValidDate;