import { useState, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { ExpandedCardPortal } from "./ExpandedCardPortal";

export interface ClickableWordMedia {
  word: string;
  imageSrc: string;
  imageAlt?: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function renderTextWithClickableWords(
  text: string,
  triggers: ClickableWordMedia[],
  accentColor: string,
): ReactNode {
  if (!triggers.length) return text;

  const pattern = new RegExp(
    `(${triggers.map((t) => escapeRegExp(t.word)).join("|")})`,
    "gi",
  );
  const parts = text.split(pattern).filter((part) => part.length > 0);

  return parts.map((part, index) => {
    const trigger = triggers.find(
      (t) => t.word.toLowerCase() === part.toLowerCase(),
    );
    if (!trigger) {
      return <span key={`${index}-${part}`}>{part}</span>;
    }
    return (
      <InlineMediaTrigger
        key={`${index}-${part}`}
        label={part}
        imageSrc={trigger.imageSrc}
        imageAlt={trigger.imageAlt ?? part}
        accentColor={accentColor}
      />
    );
  });
}

export function InlineMediaTrigger({
  label,
  imageSrc,
  imageAlt,
  accentColor,
}: {
  label: string;
  imageSrc: string;
  imageAlt: string;
  accentColor: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        data-no-click-advance
        aria-label={`Ver: ${imageAlt}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="inline cursor-pointer border-0 bg-transparent p-0 font-inherit text-inherit underline decoration-dotted underline-offset-[0.2em] outline-none transition-[color,text-shadow] duration-200 hover:decoration-solid focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
        style={{
          textShadow: `0 0 20px ${accentColor}55`,
        }}
      >
        {label}
      </button>
      <AnimatePresence>
        {open && (
          <ExpandedCardPortal
            text={label}
            imageSrc={imageSrc}
            imageAlt={imageAlt}
            accentColor={accentColor}
            reducedMotion={false}
            origin={null}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
