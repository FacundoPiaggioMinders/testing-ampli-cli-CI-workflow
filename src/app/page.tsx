"use client";

import { useState } from "react";
import { track, identify, reset, type EventProperties } from "@/lib/analytics";

type LogEntry = {
  id: number;
  timestamp: string;
  name: string;
  properties?: EventProperties;
};

const apiKeyConfigured = Boolean(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);

export default function Home() {
  const [log, setLog] = useState<LogEntry[]>([]);
  const [counter, setCounter] = useState(0);

  function record(name: string, properties?: EventProperties) {
    track(name, properties);
    setLog((prev) =>
      [
        {
          id: Date.now() + Math.random(),
          timestamp: new Date().toLocaleTimeString(),
          name,
          properties,
        },
        ...prev,
      ].slice(0, 25)
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12 flex-1">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Ampli CLI Test App</h1>
        <p className="mt-2 text-sm text-neutral-500">
          A minimal Next.js sandbox for exercising the Amplitude{" "}
          <code className="font-mono">ampli</code> CLI workflow — pull, status, push.
        </p>
        <div
          className={`mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
            apiKeyConfigured
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              apiKeyConfigured ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          {apiKeyConfigured
            ? "NEXT_PUBLIC_AMPLITUDE_API_KEY detected"
            : "No API key set — events log locally only"}
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        <ActionButton
          title="Button Clicked"
          description="Generic interaction event"
          onClick={() => {
            const next = counter + 1;
            setCounter(next);
            record("Button Clicked", { label: "primary", clickIndex: next });
          }}
        />
        <ActionButton
          title="User Signed Up"
          description="Identify + track in one shot"
          onClick={() => {
            const userId = `user_${Math.floor(Math.random() * 100000)}`;
            identify(userId, { plan: "free", source: "test-app" });
            record("User Signed Up", { userId, plan: "free" });
          }}
        />
        <ActionButton
          title="Item Purchased"
          description="Event with numeric properties"
          onClick={() =>
            record("Item Purchased", {
              sku: "SKU-1234",
              price: 19.99,
              currency: "USD",
            })
          }
        />
        <ActionButton
          title="Custom Event"
          description="Free-form event for ad-hoc testing"
          onClick={() =>
            record("Custom Event", {
              firedAt: new Date().toISOString(),
              random: Math.random().toFixed(4),
            })
          }
        />
      </section>

      <section className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => {
            reset();
            record("Session Reset");
          }}
          className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          Reset session
        </button>
        <button
          type="button"
          onClick={() => setLog([])}
          className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          Clear log
        </button>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Recent events
        </h2>
        <div className="mt-3 rounded-lg border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800 overflow-hidden">
          {log.length === 0 ? (
            <p className="px-4 py-6 text-sm text-neutral-500">
              No events yet. Click a button above.
            </p>
          ) : (
            log.map((entry) => (
              <div key={entry.id} className="px-4 py-3 text-sm font-mono">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-semibold">{entry.name}</span>
                  <span className="text-xs text-neutral-500">{entry.timestamp}</span>
                </div>
                {entry.properties && (
                  <pre className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap break-all">
                    {JSON.stringify(entry.properties, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function ActionButton({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 text-left transition hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-sm"
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-neutral-500 mt-0.5">{description}</div>
    </button>
  );
}
