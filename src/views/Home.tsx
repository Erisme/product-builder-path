import { MODULES } from "../data/modules";
import { useStore } from "../state/store";
import { built, fmtMin, isValid, nextAction, TOTAL, weekMin } from "../lib/progress";
import { go } from "../lib/router";
import { Meter } from "../components/ToolBits";
import { Backup } from "../components/Backup";

export function Home() {
  const { state, update, startSession } = useStore();
  const na = nextAction(state);
  const wm = weekMin(state);
  const goal = state.goalH * 60;
  const n = built(state);
  const list = MODULES.flatMap((m) => m.exercises.filter((e) => isValid(state, e)).map((e) => ({ m, e, s: state.exercises[e.id] })));
  const recent = state.sessions.slice(-5).reverse();

  const rememberLesson = () => {
    if (na?.lesson != null) {
      const { m, lesson } = na;
      update((d) => {
        d.ui.lesson[m.id] = lesson;
      }, false);
    }
  };

  return (
    <>
      <section className="block">
        <div className="next">
          <h2>{na ? "Votre prochaine étape" : "Parcours terminé"}</h2>
          {na ? (
            <>
              <p className="what">{na.what}</p>
              <p className="where">Étape {na.m.id}, {na.m.title}. Environ {na.time}.</p>
              <div className="row">
                <a className="btn main" href={na.href} onClick={rememberLesson}>Y aller</a>
                {!state.session && (
                  <button
                    className="btn"
                    onClick={() => {
                      rememberLesson();
                      startSession(null);
                      go(na.href);
                    }}
                  >
                    Démarrer une séance et y aller
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="what">Il reste à présenter ce que vous avez construit.</p>
              <p className="where">Relisez vos carnets avant l’entretien : ils racontent votre démarche mieux qu’un CV.</p>
            </>
          )}
        </div>
      </section>

      <section className="block" aria-labelledby="h-week">
        <h2 id="h-week">Cette semaine</h2>
        <p>
          <span className="bigfig">{fmtMin(wm)}</span> <span className="muted">sur {state.goalH} h prévues</span>
        </p>
        <Meter percent={Math.round((wm / goal) * 100)} ok={wm >= goal} />
        <div className="row" style={{ margin: "12px 0 4px" }}>
          <label htmlFor="goal">Objectif hebdomadaire</label>
          <select
            id="goal"
            className="field"
            style={{ width: "auto" }}
            value={state.goalH}
            onChange={(e) => {
              const h = Number(e.target.value);
              update((d) => {
                d.goalH = h;
              }, false);
            }}
          >
            {[4, 6, 8, 10, 12].map((h) => (
              <option key={h} value={h}>{h} h</option>
            ))}
          </select>
        </div>
        {recent.length ? (
          <>
            <h3>Dernières séances</h3>
            <ul className="plain">
              {recent.map((s) => (
                <li key={s.start}>
                  <span>
                    {new Date(s.start).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                    {s.module ? `, étape ${s.module}` : ""}
                  </span>
                  <span className="muted">{fmtMin(s.min)}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="muted small">Lancez le chrono en début de séance : le temps passé s’ajoute ici, semaine par semaine.</p>
        )}
      </section>

      <section className="block" aria-labelledby="h-built">
        <h2 id="h-built">Ce que vous avez construit</h2>
        <p>
          <span className="bigfig">{n}</span>{" "}
          <span className="muted">exercice{n > 1 ? "s" : ""} validé{n > 1 ? "s" : ""} sur {TOTAL}, chacun avec sa preuve</span>
        </p>
        {list.length ? (
          <ul className="plain">
            {list.map((x) => {
              const proof = (x.s?.proof || "").trim();
              return (
                <li key={x.e.id}>
                  <span>
                    {x.e.title}
                    <br />
                    <span className="small muted">Étape {x.m.id}, {x.e.tool}</span>
                  </span>
                  <span className="small">
                    {/^https?:\/\//.test(proof) ? (
                      <a href={proof} target="_blank" rel="noopener">Voir la preuve</a>
                    ) : (
                      proof
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="muted">Rien encore. Le premier exercice vous attend à l’étape 1 : un workflow n8n qui tourne en Docker.</p>
        )}
      </section>

      <Backup />
    </>
  );
}
