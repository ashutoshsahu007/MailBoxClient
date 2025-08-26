// src/utils/date.js
export const formatDateTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleString();
};
