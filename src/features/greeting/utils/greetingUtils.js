export function getGreeting(date = new Date(), displayName = "") {
  const hour = date.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return displayName ? `${greeting}, ${displayName}` : greeting;
}
