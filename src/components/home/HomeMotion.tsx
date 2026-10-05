"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { home } from "@/content/home";

// Server-rendered content remains readable before hydration and without JavaScript.
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (!preference.matches)
          animation = element.animate(
            [
              { opacity: 0, transform: "translateY(16px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 420, delay, easing: "ease-out", fill: "backwards" },
          );
      },
      { threshold: 0.12 },
    );
    const stop = () => {
      if (preference.matches) animation?.cancel();
    };
    preference.addEventListener("change", stop);
    observer.observe(element);
    return () => {
      observer.disconnect();
      animation?.cancel();
      preference.removeEventListener("change", stop);
    };
  }, [delay]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

const number = new Intl.NumberFormat("ru-RU");
export function CompanyStats() {
  const ref = useRef<HTMLDListElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const values = Array.from(
      element.querySelectorAll<HTMLElement>("[data-counter]"),
    );
    let frame = 0;
    const finish = () => {
      cancelAnimationFrame(frame);
      values.forEach((node, i) => {
        node.textContent =
          number.format(home.stats[i].value) + home.stats[i].suffix;
      });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (preference.matches) return;
        const started = performance.now();
        const tick = (time: number) => {
          const progress = Math.min(1, (time - started) / 1200);
          const eased = 1 - Math.pow(1 - progress, 3);
          values.forEach((node, i) => {
            node.textContent =
              number.format(Math.round(home.stats[i].value * eased)) +
              home.stats[i].suffix;
          });
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.25 },
    );
    const stop = () => {
      if (preference.matches) finish();
    };
    preference.addEventListener("change", stop);
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", stop);
    };
  }, []);
  return (
    <section className="stats-band" aria-label={home.statsLabel}>
    <div className="container container-wide">
    <dl className="company-stats" ref={ref}>
      {home.stats.map((stat) => (
        <div key={stat.label}>
          <dt>{stat.label}</dt>
          <dd>
            <span className="sr-only">
              {number.format(stat.value)}
              {stat.suffix}
            </span>
            <span aria-hidden="true" data-counter>
              {number.format(stat.value)}
              {stat.suffix}
            </span>
          </dd>
        </div>
      ))}
    </dl>
    </div>
    </section>
  );
}
