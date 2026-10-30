import { MODULES } from "../data/modules";
import type { Module } from "../data/types";
import { useStore } from "../state/store";
import { best, PASS } from "../lib/progress";

export function Locked({ m }: { m: Module }) {
  const { state, update } = useStore();
  const p = MODULES[m.id - 2];
  return (
    <section className="block">
      <h2>{m.title}</h2>
      <p className="muted">Étape {m.id} sur 5, environ {m.hours}.</p>
      <div className="locknote">
        <p>Cette étape s’ouvre quand le quiz de l’étape {p.id} atteint {PASS} %. Votre meilleur score : {best(state, p)} %.</p>
        <div className="row">
          <a className="btn main" href={"#" + p.slug + "-quiz"}>Aller au quiz de l’étape {p.id}</a>
          <button
            className="btn link"
            onClick={() =>
              update((d) => {
                d.unlocked[m.id] = true;
              })
            }
          >
            Ouvrir quand même
          </button>
        </div>
      </div>
    </section>
  );
}
