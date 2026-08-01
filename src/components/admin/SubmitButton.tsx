"use client";

import { useFormStatus } from "react-dom";

// Real Textbelt/Supabase round-trips can take a couple of seconds with no
// other feedback on the page — without this, a slow response can look
// exactly like the click didn't register at all.
export function SubmitButton({
  children,
  pendingText = "Please wait…",
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingText : children}
    </button>
  );
}
