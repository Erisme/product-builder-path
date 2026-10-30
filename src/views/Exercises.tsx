import { useState } from "react";
import type { Exercise, Module } from "../data/types";
import { EX_TOOLS } from "../data/tools";
import { useStore } from "../state/store";
import { ensureEx, exState, validatedCount } from "../lib/progress";
import { ToolLinks } from "../components/ToolBits";

function ExerciseCard({ e }: { e: Exercise }) {
  const { state, update, toast } = useStore();
  const [err, setErr] = useState("");
  const s = exState(state, e.id);
  const v = s.status === "validated";

  const validate = () => {
    if (!e.criteria.every((_, i) => s.criteria[i])) {
      setErr("Cochez tous les critères avant de valider.");
      return;
    }
    if (!(s.proof || "").trim()) {
      setErr("Ajoutez une preuve : un lien ou une description courte.");
      document.getElementById("p-" + e.id)?.focus();
      return;
    }
    update((d) => {
      const x = ensureEx(d, e.id);
      x.status = "validated";
      x.validatedAt = new Date().toISOString();
    });
    toast("Exercice validé");
  };
  const reopen = () => {
    if (confirm("Rouvrir cet exercice ? Il ne comptera plus comme validé.")) {
      update((d) => {
        ensureEx(d, e.id).status = "todo";
      });
    }
  };

  return (
    <article className={"ex" + (v ? " validated" : "")} aria-labelledby={"h-" + e.id}>
      <div className="row">
        <h3 id={"h-" + e.id}>{e.title}</h3>
        {v && <span className="tag ok" style={{ marginLeft: "auto" }}>Validé</span>}
      </div>
      <p className="meta">{e.tool}, environ {e.time}</p>
      <p>{e.brief}</p>
      {EX_TOOLS[e.id] && (
        <p className="toolsline" style={{ marginTop: -4 }}>Avant de commencer, la fiche outil : <ToolLinks slugs={EX_TOOLS[e.id]} /></p>
      )}
      <fieldset style={{ border: 0, padding: 0, margin: 0 }} className="crit">
        <legend className="small muted">Critères</legend>
        {e.criteria.map((c, i) => (
          <label key={i}>
            <input
              type="checkbox"
              checked={!!s.criteria[i]}
              disabled={v}
              onChange={(ev) => {
                const on = ev.target.checked;
                update((d) => {
                  ensureEx(d, e.id).criteria[i] = on;
                });
              }}
            />
            <span>{c}</span>
          </label>
        ))}
      </fieldset>
      <label htmlFor={"p-" + e.id} className="small muted" style={{ display: "block", margin: "10px 0 4px" }}>
        Preuve : {e.proof.toLowerCase()}
      </label>
      <input
        type="text"
        id={"p-" + e.id}
        className="field"
        value={s.proof || ""}
        placeholder="https://…"
        disabled={v}
        onChange={(ev) => {
          const val = ev.target.value;
          setErr("");
          update((d) => {
            ensureEx(d, e.id).proof = val;
          });
        }}
      />
      <p className="err">{err}</p>
      <div className="row">
        {v ? (
          <>
            <span className="small muted">Validé le {new Date(s.validatedAt!).toLocaleDateString("fr-FR")}</span>
            <button className="btn link" onClick={reopen}>Rouvrir</button>
          </>
        ) : (
          <button className="btn main" onClick={validate}>Valider l’exercice</button>
        )}
      </div>
    </article>
  );
}

export function Exercises({ m }: { m: Module }) {
  const { state } = useStore();
  return (
    <>
      <section className="block">
        <h2>Exercices : {m.title}</h2>
        <p className="muted">Un exercice se valide quand tous ses critères sont cochés et qu’une preuve est déposée. C’est cette liste que vous montrerez.</p>
      </section>
      {m.exercises.map((e) => (
        <ExerciseCard key={e.id} e={e} />
      ))}
      {validatedCount(state, m) === m.exercises.length && (
        <p><a className="btn main" href={"#" + m.slug + "-carnet"}>Écrire la rétro de l’étape</a></p>
      )}
    </>
  );
}
