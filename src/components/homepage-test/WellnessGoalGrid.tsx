import { SectionShell } from "./primitives";

const GOALS = [
  { label: "Better Sleep", copy: "Wind down with heat that signals rest." },
  { label: "Muscle Recovery", copy: "Support the body after real effort." },
  { label: "Stress Relief", copy: "A room built for slowing down." },
  { label: "Warmth & Comfort", copy: "Comfort you can step into daily." },
  { label: "Skin & Self-Care", copy: "A quiet ritual, not a routine." },
  { label: "Outdoor Reset", copy: "Bring restoration into open air." },
] as const;

export function WellnessGoalGrid() {
  return (
    <SectionShell tone="tonal-dark" title="What would you like more of?">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {GOALS.map((goal) => (
          <div
            key={goal.label}
            className="rounded-xl border-t border-gold/50 bg-charcoal-800 p-4"
          >
            <p className="text-sm font-semibold text-[#f7f1e5]">
              {goal.label}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#c9c3b8]">
              {goal.copy}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-6 max-w-[65ch] text-xs text-[#c9c3b8]">
        Soothing Saunas products support comfort, routine, and recovery
        experiences. They are not intended to diagnose, treat, or cure any
        medical condition.
      </p>
    </SectionShell>
  );
}
