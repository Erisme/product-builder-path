import type { Module } from "../data/types";
import { useStore } from "../state/store";
import type { NoteKey } from "../state/types";
import { isDone, noteDone } from "../lib/progress";

const QUESTIONS: [NoteKey, string, string][] = [
  ["got", "Ce que j’ai compris", "Une idée qui a changé votre façon de voir le sujet."],
  ["stuck", "Ce qui m’a bloqué", "Où avez-vous perdu du temps, et pourquoi ?"],
  ["change", "Ce que je change pour la suite", "Une seule décision concrète pour l’étape suivante."],
];

export function Notebook({ m }: { m: Module }) {
  const { state, update } = useStore();
  const n = state.notes[m.id] || {};
  return (
    <section className="block">
      <h2>Carnet : {m.title}</h2>
      <p className="muted">Personne ne relit ce carnet à votre place. Trois réponses courtes suffisent ; elles serviront de matière pour l’entretien.</p>
      {QUESTIONS.map(([k, label, hint]) => (
        <div key={k}>
          <h3><label htmlFor={"n-" + k}>{label}</label></h3>
          <p className="small muted" id={"hint-" + k}>{hint}</p>
          <textarea
            className="field"
            id={"n-" + k}
            aria-describedby={"hint-" + k}
            value={n[k] || ""}
            onChange={(ev) => {
              const val = ev.target.value;
              update((d) => {
                (d.notes[m.id] ??= {})[k] = val;
              });
            }}
          />
        </div>
      ))}
      <p className="small muted" style={{ marginTop: 12 }} aria-live="polite">
        {noteDone(state, m) ? "Carnet complet, enregistré." : "Enregistré automatiquement."}
      </p>
      {m.id < 5 && isDone(state, m) && (
        <p><a className="btn main" href={"#module-" + (m.id + 1)}>Étape suivante</a></p>
      )}
    </section>
  );
}
