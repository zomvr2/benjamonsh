"use client";
import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { useInView } from "motion/react";

const noop = () => () => {};

/** Conversación que se «escribe» una vez al verse. Sin JS (o antes de hidratar) las burbujas ya están visibles. */
export default function ChatReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  return (
    <div className="chat" ref={ref} data-reveal={!hydrated ? undefined : inView ? "go" : "wait"}>
      {children}
    </div>
  );
}
