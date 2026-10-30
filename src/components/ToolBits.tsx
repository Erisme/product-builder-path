// Petits composants partagés autour des fiches outils.
import { tool } from "../data/tools";
import type { Tool } from "../data/types";

export function ToolLinks({ slugs }: { slugs: string[] | undefined }) {
  const list = (slugs || []).map(tool).filter((t): t is Tool => !!t);
  return (
    <>
      {list.map((t, i) => (
        <span key={t.slug}>
          {i > 0 && ", "}
          <a href={"#outil-" + t.slug}>{t.name}</a>
        </span>
      ))}
    </>
  );
}

export function ToolCard({ slug }: { slug: string }) {
  const x = tool(slug);
  if (!x) return null;
  return (
    <a className="toolcard" href={"#outil-" + x.slug}>
      <strong>{x.name}</strong>
      <span className="c">{x.cat}, étape {x.step}</span>
      <span className="w">{x.what.split(/(?<=[.:])\s/)[0]}</span>
    </a>
  );
}

export function Meter({ percent, ok }: { percent: number; ok?: boolean }) {
  return (
    <div className={"meter" + (ok ? " ok" : "")} aria-hidden="true">
      <span style={{ width: Math.min(100, Math.max(0, percent)) + "%" }}></span>
    </div>
  );
}
