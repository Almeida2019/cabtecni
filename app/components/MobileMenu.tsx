"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { localePath, type Locale } from "../i18n/config";
import type { NavKey } from "../navigation";

type Props = {
  locale: Locale;
  active?: NavKey;
  items: { key: NavKey; path: string; label: string }[];
  openLabel: string;
  closeLabel: string;
};

export function MobileMenu({ locale, active, items, openLabel, closeLabel }: Props) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement | null>(null);

  // A menu that only closes by tapping the toggle again feels broken on a
  // phone, so close on outside tap and on Escape too.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="mobile-menu" ref={wrapper}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{open ? "✕" : "☰"}</span>
      </button>
      <div id="mobile-navigation" hidden={!open}>
        {items.map((item) => (
          <Link
            key={item.key}
            href={localePath(locale, item.path)}
            aria-current={active === item.key ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
