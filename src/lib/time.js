import { useEffect, useState } from "react";

const CAMPUS_TIME_ZONE = "Africa/Lagos";

export function formatCampusDate(
  date = new Date(),
  options = { weekday: "long", day: "numeric", month: "long", year: "numeric" }
) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: CAMPUS_TIME_ZONE,
    ...options
  }).format(date);
}

function getCampusHour(date) {
  try {
    const hour = new Intl.DateTimeFormat("en-GB", {
      timeZone: CAMPUS_TIME_ZONE,
      hour: "2-digit",
      hourCycle: "h23"
    })
      .formatToParts(date)
      .find((part) => part.type === "hour")?.value;

    return Number(hour);
  } catch {
    return date.getHours();
  }
}

export function getGreeting(date = new Date()) {
  const hour = getCampusHour(date);
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function useCampusNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}
