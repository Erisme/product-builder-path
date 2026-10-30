import type { Module } from "../data/types";
import { EX_TOOLS, LESSON_TOOLS } from "../data/tools";
import { useStore } from "../state/store";
import { isDone, modulePercent, steps } from "../lib/progress";
import { Meter, ToolCard } from "../components/ToolBits";

export function Overview({ m }: { m: Module }) {
  const { state } = useStore();
  const tools = [...new Set([...m.lessons.map((l) => LESSON_TOOLS[l.id] || []), ...m.exercises.map((e) => EX_TOOLS[e.id] || [])].flat())];
  return (
    <>
      <section className="block">
        <h2>{m.title}</h2>
        <p className="muted">Étape {m.id} sur 5, environ {m.hours}.</p>
        <p>{m.goal}</p>
        <Meter percent={modulePercent(state, m)} ok={isDone(state, m)} />
      </section>
      <section className="block">
        <h2>Dans l’ordre</h2>
        <ol className="steps">
          {steps(state, m).map((s) => (
            <li key={s.v} className={s.done ? "done" : ""}>
              <div>
                <strong>{s.name}</strong>
                <p className="d">{s.d}</p>
              </div>
              <a className={"btn" + (s.done ? "" : " main")} href={"#" + m.slug + "-" + s.v}>
                {s.done ? "Revoir" : "Ouvrir"}
                <span className="sr-only"> {s.name.toLowerCase()}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>
      {tools.length > 0 && (
        <section className="block">
          <h2>Les outils de l’étape</h2>
          <p className="muted">À quoi ils servent, avec des exemples concrets et un essai de 15 minutes.</p>
          <div className="tools">
            {tools.map((s) => (
              <ToolCard key={s} slug={s} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
