import type { BusinessDayHours, BusinessDayKey, WeeklyBusinessHours } from "@/types/catalog";

export const BUSINESS_DAYS: BusinessDayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const BUSINESS_DAY_LABELS: Record<BusinessDayKey, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const BUSINESS_DAY_SHORT: Record<BusinessDayKey, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

function openDay(open = "10:00", close = "19:00"): BusinessDayHours {
  return { closed: false, open, close };
}

function closedDay(): BusinessDayHours {
  return { closed: true, open: "10:00", close: "19:00" };
}

export function defaultWeeklyBusinessHours(): WeeklyBusinessHours {
  return {
    timezone: "IST",
    monday: openDay(),
    tuesday: openDay(),
    wednesday: openDay(),
    thursday: openDay(),
    friday: openDay(),
    saturday: openDay(),
    sunday: closedDay(),
  };
}

function normalizeDay(raw: Partial<BusinessDayHours> | undefined, fallback: BusinessDayHours): BusinessDayHours {
  if (!raw) return fallback;
  return {
    closed: Boolean(raw.closed),
    open: raw.open || fallback.open,
    close: raw.close || fallback.close,
  };
}

export function normalizeWeeklyBusinessHours(raw?: Partial<WeeklyBusinessHours> | null): WeeklyBusinessHours {
  const defaults = defaultWeeklyBusinessHours();
  if (!raw) return defaults;
  return {
    timezone: raw.timezone?.trim() || defaults.timezone,
    monday: normalizeDay(raw.monday, defaults.monday),
    tuesday: normalizeDay(raw.tuesday, defaults.tuesday),
    wednesday: normalizeDay(raw.wednesday, defaults.wednesday),
    thursday: normalizeDay(raw.thursday, defaults.thursday),
    friday: normalizeDay(raw.friday, defaults.friday),
    saturday: normalizeDay(raw.saturday, defaults.saturday),
    sunday: normalizeDay(raw.sunday, defaults.sunday),
  };
}

function daySignature(day: BusinessDayHours) {
  return day.closed ? "closed" : `${day.open}-${day.close}`;
}

function formatRangeLabel(keys: BusinessDayKey[]) {
  if (keys.length === 1) return BUSINESS_DAY_SHORT[keys[0]!];
  const first = BUSINESS_DAY_SHORT[keys[0]!];
  const last = BUSINESS_DAY_SHORT[keys[keys.length - 1]!];
  return `${first}–${last}`;
}

function groupBusinessHours(hours: WeeklyBusinessHours) {
  const groups: { keys: BusinessDayKey[]; day: BusinessDayHours }[] = [];

  for (const key of BUSINESS_DAYS) {
    const day = hours[key];
    const previous = groups[groups.length - 1];
    if (previous && daySignature(previous.day) === daySignature(day)) {
      previous.keys.push(key);
      continue;
    }
    groups.push({ keys: [key], day });
  }

  return groups;
}

export function businessHoursSummary(hours: WeeklyBusinessHours) {
  const timezone = hours.timezone.trim();
  return groupBusinessHours(hours).map((group) => {
    const label = formatRangeLabel(group.keys);
    if (group.day.closed) return `${label} · Closed`;
    const range = `${label} · ${group.day.open}–${group.day.close}`;
    return timezone ? `${range} ${timezone}` : range;
  });
}

export function formatBusinessHours(hours: WeeklyBusinessHours) {
  return businessHoursSummary(hours).join(" · ");
}

export function formatBusinessHoursLines(hours: WeeklyBusinessHours) {
  return businessHoursSummary(hours);
}

export function applyHoursToDays(hours: WeeklyBusinessHours, keys: BusinessDayKey[], template: BusinessDayHours) {
  const next = { ...hours };
  for (const key of keys) {
    next[key] = { ...template };
  }
  return next;
}

export function validateBusinessHours(hours: WeeklyBusinessHours) {
  for (const key of BUSINESS_DAYS) {
    const day = hours[key];
    if (day.closed) continue;
    if (!day.open || !day.close) throw new Error(`${BUSINESS_DAY_LABELS[key]} needs open and close times.`);
    if (day.open >= day.close) throw new Error(`${BUSINESS_DAY_LABELS[key]} close time must be after open time.`);
  }
}
