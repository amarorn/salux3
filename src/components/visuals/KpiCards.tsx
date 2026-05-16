import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import clsx from "clsx";
import type { NarrativeMetric } from "@/domain/types";
import { DonutRing } from "./DonutRing";
import { Sparkline } from "./Sparkline";

interface KpiCardsProps {
  items: NarrativeMetric[];
  active: boolean;
  reducedMotion: boolean;
  accentColor: string;
}

function formatBR(value: number, decimals: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function KpiCards({
  items,
  active,
  reducedMotion,
  accentColor,
}: KpiCardsProps) {
  const container = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reducedMotion ? 0 : 0.1,
        staggerChildren: reducedMotion ? 0 : 0.18,
      },
    },
  };

  const card = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 18, filter: "none" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "none",
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.div
      variants={container}
      initial={reducedMotion ? false : "hidden"}
      animate={active ? "visible" : "hidden"}
      className="grid gap-4 sm:grid-cols-2"
    >
      {items.map((item, i) => (
        <motion.div key={`${item.value}-${item.suffix}-${i}`} variants={card}>
          <KpiCard
            item={item}
            accentColor={accentColor}
            active={active}
            reducedMotion={reducedMotion}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

interface KpiCardProps {
  item: NarrativeMetric;
  accentColor: string;
  active: boolean;
  reducedMotion: boolean;
}

function KpiCard({ item, accentColor, active, reducedMotion }: KpiCardProps) {
  const decimals = item.decimals ?? 0;
  const target = item.value;
  const [display, setDisplay] = useState(reducedMotion || !active ? target : 0);

  useEffect(() => {
    if (!active || reducedMotion) {
      setDisplay(target);
      return;
    }
    setDisplay(0);
    const controls = animate(0, target, {
      duration: 1.55,
      delay: 0.25,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [active, reducedMotion, target]);

  const ringValue = item.ring ?? (target >= 0 && target <= 100 ? target : 50);
  const deltaUnit = item.deltaUnit ?? "pp";
  const unit = item.unit ?? "%";

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition-[border-color,box-shadow] duration-300 hover:border-white/[0.14]"
      style={{
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 32px -16px ${accentColor}55`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-5 -top-px h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}aa, transparent)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-40"
        style={{
          background: `radial-gradient(circle, ${accentColor}33, transparent 70%)`,
        }}
      />

      <div className="relative flex items-center gap-4">
        <DonutRing
          value={ringValue}
          color={accentColor}
          size={92}
          thickness={7}
          active={active}
          reducedMotion={reducedMotion}
        >
          <span
            className={clsx(
              "font-display text-[1.15rem] font-bold tabular-nums leading-none tracking-tight",
            )}
            style={{
              color: accentColor,
              textShadow: `0 0 10px ${accentColor}88`,
            }}
          >
            {formatBR(display, decimals)}
            {unit && (
              <span className="ml-0.5 text-[0.85em] font-semibold opacity-75">
                {unit}
              </span>
            )}
          </span>
        </DonutRing>

        <div className="min-w-0 flex-1">
          {item.label && (
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: accentColor, opacity: 0.85 }}
            >
              {item.label}
            </p>
          )}
          <p className="mt-1 text-[13px] font-medium leading-snug text-slate-200/85">
            {item.suffix}
          </p>
          {typeof item.delta === "number" && (
            <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold tabular-nums">
              <span
                style={{
                  color: item.delta >= 0 ? "#fb7185" : "#34d399",
                }}
              >
                {item.delta >= 0 ? "▲" : "▼"}{" "}
                {formatBR(Math.abs(item.delta), 1)} {deltaUnit}
              </span>
              <span className="text-slate-400/70">vs período anterior</span>
            </p>
          )}
        </div>
      </div>

      {item.trend && item.trend.length >= 2 && (
        <div className="relative mt-4">
          <Sparkline
            data={item.trend}
            color={accentColor}
            width={300}
            height={48}
            active={active}
            reducedMotion={reducedMotion}
          />
        </div>
      )}
    </div>
  );
}
