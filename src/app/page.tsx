"use client";

import { useState } from "react";
import { ampli } from "@/ampli";
import { identifyUser, resetSession } from "@/lib/analytics";

type LogEntry = {
  id: number;
  timestamp: string;
  name: string;
  properties?: Record<string, unknown>;
};

export default function Home() {
  const [log, setLog] = useState<LogEntry[]>([]);

  function record(name: string, properties?: Record<string, unknown>) {
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
          Each button fires a typed event from{" "}
          <code className="font-mono">src/ampli/index.ts</code>. The static call is what
          {" "}
          <code className="font-mono">ampli status</code> looks for in CI.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        <ActionButton
          title="Evento1"
          description="Required: eje, Propiedad1"
          onClick={() => {
            const props = { eje: "axis-1", Propiedad1: "valor-uno" };
            ampli.evento1(props);
            record("Evento1", props);
          }}
        />
        <ActionButton
          title="Evento 2"
          description="Required: je (string[])"
          onClick={() => {
            const props = { je: ["alpha", "beta", "gamma"] };
            ampli.evento2(props);
            record("Evento 2", props);
          }}
        />
        <ActionButton
          title="eventoConArray"
          description="Optional: arrayBien, arrayString"
          onClick={() => {
            const props = {
              arrayBien: ["uno", "dos", "tres"],
              arrayString: "single",
            };
            ampli.eventoConArray(props);
            record("eventoConArray", props);
          }}
        />
        <ActionButton
          title="PruebaAmpli"
          description="Optional: propiedad_a_mantener, propiedad_a_mergear"
          onClick={() => {
            const props = {
              propiedad_a_mantener: "keep",
              propiedad_a_mergear: "merge",
            };
            ampli.pruebaAmpli(props);
            record("PruebaAmpli", props);
          }}
        />
      </section>

      <section className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => {
            const userId = `user_${Math.floor(Math.random() * 100000)}`;
            identifyUser(userId, { email: `${userId}@example.com` });
            record("identify()", { userId });
          }}
          className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          Identify random user
        </button>
        <button
          type="button"
          onClick={() => {
            resetSession();
            record("session reset");
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
