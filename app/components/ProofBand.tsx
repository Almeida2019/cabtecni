import { getDictionary } from "../i18n";
import type { Locale } from "../i18n/config";

export function ProofBand({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const points = [
    { value: "100%", label: t.proof.angolan },
    { value: "7", label: t.proof.sectors },
    { value: "8", label: t.proof.serviceLines },
    { value: "24/7", label: t.proof.responsive },
  ];

  return (
    <section className="proof-band" aria-label={t.proof.ariaLabel}>
      <div className="site-shell proof-inner">
        {points.map((point, index) => (
          <div key={point.label} data-reveal data-reveal-delay={index + 1}>
            <strong data-countup>{point.value}</strong>
            <span>{point.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
