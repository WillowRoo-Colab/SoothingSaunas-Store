"use client";

import { useState } from "react";
import type { TickerMessage } from "@/lib/scrollingTickers";

let nextId = 0;
function newId() {
  nextId += 1;
  return `new-${Date.now()}-${nextId}`;
}

export function TickerMessagesField({ initialMessages }: { initialMessages: TickerMessage[] }) {
  const [messages, setMessages] = useState<TickerMessage[]>(
    initialMessages.length > 0 ? initialMessages : [{ id: newId(), text: "" }]
  );

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Messages</span>
      {messages.map((message, index) => (
        <div key={message.id} className="flex items-center gap-2">
          <input
            type="text"
            value={message.text}
            onChange={(e) => {
              const next = [...messages];
              next[index] = { ...message, text: e.target.value };
              setMessages(next);
            }}
            placeholder={`Message ${index + 1}`}
            className="flex-1 rounded border border-silver px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => setMessages(messages.filter((m) => m.id !== message.id))}
            disabled={messages.length === 1}
            className="rounded border border-silver px-2 py-1 text-xs text-charcoal/60 transition-colors hover:text-red-600 disabled:opacity-40"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setMessages([...messages, { id: newId(), text: "" }])}
        className="mt-1 self-start text-xs font-medium text-charcoal/70 underline hover:text-charcoal"
      >
        + Add message
      </button>

      <input type="hidden" name="messagesJson" value={JSON.stringify(messages)} />
    </div>
  );
}
