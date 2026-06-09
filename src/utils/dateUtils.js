function pad(value) {
  return String(value).padStart(2, "0");
}

export function formatTime(
  date = new Date(),
  format = "24h",
  showSeconds = false,
) {
  const hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  if (format === "12h") {
    const normalizedHours = hours % 12 || 12;
    const suffix = hours < 12 ? "AM" : "PM";
    return showSeconds
      ? `${normalizedHours}:${minutes}:${seconds} ${suffix}`
      : `${normalizedHours}:${minutes} ${suffix}`;
  }

  return showSeconds
    ? `${pad(hours)}:${minutes}:${seconds}`
    : `${pad(hours)}:${minutes}`;
}

export function formatDate(date = new Date()) {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
