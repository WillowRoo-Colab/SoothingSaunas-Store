"use client";

import { useEffect, useRef, useState } from "react";

const HIDDEN_STYLES = {
  fade: "opacity-0 translate-y-6",
  pop: "opacity-0 translate-y-10 scale-95 [transform:perspective(800px)_rotateX(8deg)]",
} as const;

const VISIBLE_STYLES = {
  fade: "opacity-100 translate-y-0",
  pop: "opacity-100 translate-y-0 scale-100 [transform:perspective(800px)_rotateX(0deg)]",
} as const;

const DURATION = {
  fade: "duration-700",
  pop: "duration-700",
} as const;

export function ScrollReveal({
  children,
  variant = "fade",
  className,
}: {
  children: React.ReactNode;
  variant?: "fade" | "pop";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Defer to a rAF callback rather than setting state synchronously in
      // the effect body (react-hooks/set-state-in-effect).
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${DURATION[variant]} ${
        visible ? VISIBLE_STYLES[variant] : HIDDEN_STYLES[variant]
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
