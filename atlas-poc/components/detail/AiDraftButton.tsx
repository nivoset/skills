"use client";

import { useState } from "react";

export default function AiDraftButton({
  contractName,
  description,
}: {
  contractName: string;
  description?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const [mocked, setMocked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/draft-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractName, description }),
      });
      const data = await res.json();
      setDraft(data.draft);
      setMocked(data.mocked);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-draft-box">
      <button className="ai-draft-btn" onClick={run} disabled={loading}>
        {loading ? "Drafting…" : "Draft a scenario with AI"}
      </button>
      {draft && (
        <>
          <div className="ai-draft-out">{draft}</div>
          {mocked && (
            <div className="ai-note">
              Demo draft — no ANTHROPIC_API_KEY is set in this sandbox. Real
              call is wired up in app/api/ai/draft-scenario/route.ts.
            </div>
          )}
        </>
      )}
    </div>
  );
}
