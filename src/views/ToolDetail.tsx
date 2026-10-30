import { MODULES } from "../data/modules";
import { EX_TOOLS, TOOLS } from "../data/tools";
import type { Tool } from "../data/types";
import { useStore } from "../state/store";
import { isValid } from "../lib/progress";

// Met en <code> la commande « docker run … » éventuelle du texte d'essai.
function TryText({ text }: { text: string }) {
  const m = text.match(/(docker run [^,]+)/);
  if (!m || m.index == null) return <>{text}</>;
  return (
    <>
      {text.slice(0, m.index)}
      <code>{m[1]}</code>
      {text.slice(m.index + m[1].length)}
    </>
  );
}

export function ToolDetail({ x }: { x: Tool }) {
  const { state } = useStore();
  const i = TOOLS.indexOf(x);
  const prev = TOOLS[i - 1];
  const next = TOOLS[i + 1];
  const used = MODULES.flatMap((m) => m.exercises.filter((e) => (EX_TOOLS[e.id] || []).includes(x.slug)).map((e) => ({ m, e })));
  return (
    <>
      <section className="block">
        <p className="small"><a href="#outils">Boîte à outils</a></p>
        <h2>{x.name}</h2>
        <p className="muted">
          {x.cat}, abordé à l’étape {x.step} : <a href={"#module-" + x.step}>{MODULES[x.step - 1].title}</a>
        </p>
        <h3>À quoi ça sert</h3>
        <p>{x.what}</p>
      </section>
      <section className="block">
        <h2>Exemples concrets</h2>
        {x.examples.map((ex) => (
          <article className="usecase" key={ex.t}>
            <h4>{ex.t}</h4>
            <ol className="flow" aria-label="Enchaînement">
              {ex.flow.map((f, k) => (
                <li key={k}><span>{f}</span></li>
              ))}
            </ol>
            <p>{ex.d}</p>
          </article>
        ))}
      </section>
      <section className="block">
        <h2>À essayer en 15 minutes</h2>
        <div className="try">
          <p style={{ margin: 0 }}><TryText text={x.try} /></p>
        </div>
      </section>
      <section className="block pair">
        <div>
          <h3 style={{ marginTop: 0 }}>Quand l’utiliser</h3>
          <p>{x.use}</p>
        </div>
        <div>
          <h3 style={{ marginTop: 0 }}>Quand l’éviter</h3>
          <p>{x.avoid}</p>
        </div>
      </section>
      <section className="block">
        <p><a href={x.doc} target="_blank" rel="noopener">Documentation officielle de {x.name}</a></p>
        {used.length > 0 && (
          <>
            <h3>Dans le parcours</h3>
            <ul className="plain">
              {used.map((u) => (
                <li key={u.e.id}>
                  <a href={"#" + u.m.slug + "-exercices"}>{u.e.title}</a>
                  <span className="muted small">Étape {u.m.id}{isValid(state, u.e) ? ", validé" : ""}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="row" style={{ marginTop: 16 }}>
          {prev && <a className="btn" href={"#outil-" + prev.slug}>{prev.name}</a>}
          {next && <a className="btn main" href={"#outil-" + next.slug}>Outil suivant : {next.name}</a>}
        </div>
      </section>
    </>
  );
}
