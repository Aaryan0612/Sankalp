export function isoDateForTimezone(timezone, date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function weekdayForTimezone(timezone, date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long"
  }).format(date).toLowerCase();
}

export function displayDateForTimezone(timezone, date = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function parseIsoDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatIsoDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addUtcDays(dateString, amount) {
  const date = parseIsoDate(dateString);
  date.setUTCDate(date.getUTCDate() + amount);
  return formatIsoDate(date);
}

export function startOfWeekIso(dateString) {
  const date = parseIsoDate(dateString);
  const weekday = date.getUTCDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  date.setUTCDate(date.getUTCDate() + offset);
  return formatIsoDate(date);
}

export function currentLocalHourBucket(timezone) {
  const date = new Date();

  const hour = timezone
    ? Number(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: timezone,
          hour: "2-digit",
          hour12: false
        }).format(date)
      )
    : date.getHours();

  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

export function timeNowForTimezone(timezone) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());
}

export function daysUntilBirthday(timezone, month, day, date = new Date()) {
  const todayIso = isoDateForTimezone(timezone, date);
  const [year] = todayIso.split("-").map(Number);
  const candidateThisYear = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const target = todayIso <= candidateThisYear ? candidateThisYear : `${year + 1}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return Math.max(0, dateDiffIso(todayIso, target));
}

export function dateDiffIso(startDate, endDate) {
  const start = parseIsoDate(startDate).getTime();
  const end = parseIsoDate(endDate).getTime();
  return Math.floor((end - start) / 86400000);
}
