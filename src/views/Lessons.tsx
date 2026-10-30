import { useEffect, useRef } from "react";
import type { Module } from "../data/types";
import { LESSON_TOOLS } from "../data/tools";
import { useStore } from "../state/store";
import { go } from "../lib/router";
import { ToolLinks } from "../components/ToolBits";

export function Lessons({ m }: { m: Module }) {
  const { state, update } = useStore();
  const n = m.lessons.length;
  let i = state.ui.lesson[m.id];
  if (i == null) {
    i = m.lessons.findIndex((l) => !state.lessons[l.id]);
    if (i < 0) i = 0;
  }
  i = Math.max(0, Math.min(n - 1, i));
  const l = m.lessons[i];
  const read = !!state.lessons[l.id];
  const last = i === n - 1;

  // Après « fiche suivante », on remonte et on donne le focus au titre.
  const heading = useRef<HTMLHeadingElement>(null);
  const focusNext = useRef(false);
  useEffect(() => {
    if (focusNext.current) {
      focusNext.current = false;
      window.scrollTo({ top: 0 });
      heading.current?.focus();
    }
  }, [i]);

  const goTo = (k: number) => {
    update((d) => {
      d.ui.lesson[m.id] = k;
    }, false);
    window.scrollTo({ top: 0 });
  };
  const next = () => {
    if (last) {
      update((d) => {
        d.lessons[l.id] = true;
      });
      go("#" + m.slug + "-quiz");
    } else {
      focusNext.current = true;
      update((d) => {
        d.lessons[l.id] = true;
        d.ui.lesson[m.id] = i + 1;
      });
    }
  };

  return (
    <section className="block">
      <p className="muted small">Fiche {i + 1} sur {n}, {m.title}</p>
      <div className="pager" aria-hidden="true">
        {m.lessons.map((x, k) => (
          <span key={x.id} className={k === i ? "here" : state.lessons[x.id] ? "read" : ""}></span>
        ))}
      </div>
      <article className="lesson" aria-labelledby="h-lesson">
        <h2 id="h-lesson" ref={heading} tabIndex={-1}>{l.title}</h2>
        {l.body.map((p, k) => (
          <p key={k}>{p}</p>
        ))}
        {LESSON_TOOLS[l.id] && (
          <p className="toolsline">Fiches outils : <ToolLinks slugs={LESSON_TOOLS[l.id]} /></p>
        )}
        {l.sources.length > 0 && (
          <div className="sources">
            Pour aller plus loin{" "}
            {l.sources.map(([label, url]) => (
              <a key={url} href={url} target="_blank" rel="noopener">{label}</a>
            ))}
          </div>
        )}
      </article>
      <div className="row" style={{ marginTop: 18 }}>
        <button className="btn" disabled={i === 0} onClick={() => goTo(i - 1)}>Fiche précédente</button>
        <button className="btn main" onClick={next}>{last ? "J’ai lu, passer au quiz" : "J’ai lu, fiche suivante"}</button>
        {read && (
          <>
            <span className="tag ok">Lue</span>
            <button
              className="btn link"
              onClick={() =>
                update((d) => {
                  d.lessons[l.id] = false;
                })
              }
            >
              Marquer comme non lue
            </button>
          </>
        )}
      </div>
    </section>
  );
}
