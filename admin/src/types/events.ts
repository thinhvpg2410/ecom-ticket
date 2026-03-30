export const EVENT_CATEGORIES = [
  "Xu hướng",
  "Tham quan & trải nghiệm",
  "Sân khấu & nghệ thuật",
  "Thể thao",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const EVENT_LOCATIONS = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Other"] as const;
export type EventLocation = (typeof EVENT_LOCATIONS)[number];

export const EVENT_TYPES = ["concert", "event"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_STATUSES = ["draft", "published", "cancelled", "ended"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];
