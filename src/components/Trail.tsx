import { MODULES } from "../data/modules";
import { useStore } from "../state/store";
import { best, isDone, isUnlocked, lessonsRead, steps, validatedCount } from "../lib/progress";
import type { Route } from "../lib/router";

export function Trail({ route }: { route: Route }) {
  const { state } = useStore();
  const cur = (on: boolean) => (on ? "page" : undefined);
  return (
    <aside className="side">
      <nav aria-label="Le parcours">
        <a className="homelink" href="#accueil" aria-current={cur(route.view === "accueil")}>Tableau de bord</a>
        <a className="homelink sub2" href="#outils" aria-current={cur(route.view === "outils" || route.view === "outil")}>Boîte à outils</a>
        <ol className="trail">
          {MODULES.map((m) => {
            const unlocked = isUnlocked(state, m);
            const cls = isDone(state, m) ? "done" : !unlocked ? "locked" : lessonsRead(state, m) || best(state, m) || validatedCount(state, m) ? "started" : "todo";
            const status = isDone(state, m) ? "terminée" : !unlocked ? "verrouillée" : m.hours;
            const open = route.m?.id === m.id && unlocked;
            return (
              <li key={m.id} className={"stage " + cls}>
                <a href={"#" + m.slug} aria-current={cur(route.key === m.slug)}>
                  <span className="blaze" aria-hidden="true"></span>
                  <span className="t">
                    {m.title}
                    <small>Étape {m.id}, {status}</small>
                  </span>
                </a>
                {open && (
                  <ul className="substeps">
                    {steps(state, m).map((s) => (
                      <li key={s.v}>
                        <a href={"#" + m.slug + "-" + s.v} aria-current={cur(route.key === m.slug + "-" + s.v)}>
                          {s.name}
                          <span>{s.status}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
