import isValidDate from "@/utils/is-valid-date";

const iso2LocalDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  if (!isValidDate(date)) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default iso2LocalDateTime;