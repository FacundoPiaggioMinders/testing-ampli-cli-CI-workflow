import * as amplitude from "@amplitude/analytics-browser";

let initialized = false;

export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;

  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
  if (!apiKey) {
    console.warn(
      "[analytics] NEXT_PUBLIC_AMPLITUDE_API_KEY is not set — events will be logged but not delivered."
    );
    initialized = true;
    return;
  }

  amplitude.init(apiKey, {
    autocapture: { pageViews: true, sessions: true, formInteractions: false, fileDownloads: false },
    defaultTracking: false,
  });

  initialized = true;
}

export type EventProperties = Record<string, string | number | boolean | null | undefined>;

export function track(eventName: string, properties?: EventProperties) {
  if (typeof window === "undefined") return;
  amplitude.track(eventName, properties);
}

export function identify(userId: string, properties?: EventProperties) {
  if (typeof window === "undefined") return;
  amplitude.setUserId(userId);
  if (properties) {
    const ident = new amplitude.Identify();
    for (const [key, value] of Object.entries(properties)) {
      if (value === undefined || value === null) continue;
      ident.set(key, value);
    }
    amplitude.identify(ident);
  }
}

export function reset() {
  if (typeof window === "undefined") return;
  amplitude.reset();
}
