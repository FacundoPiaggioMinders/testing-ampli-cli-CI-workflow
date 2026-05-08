import { ampli } from "@/ampli";

let initialized = false;

export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;

  ampli.load({ environment: "facutestdev" });
  initialized = true;
}

export function identifyUser(userId: string, properties?: Parameters<typeof ampli.identify>[1]) {
  if (typeof window === "undefined") return;
  ampli.identify(userId, properties);
}

export function resetSession() {
  if (typeof window === "undefined") return;
  ampli.client.reset();
}
