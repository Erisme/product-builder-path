import { useEffect, useState } from "react";
import { useStore } from "../state/store";
import { elapsed, fmtMin, weekMin } from "../lib/progress";

export function Header({ moduleId }: { moduleId: number | null }) {
  const { state, startSession, stopSession } = useStore();
  // Rafraîchit le chrono toutes les 15 s pendant une séance.
  const [, tick] = useState(0);
  useEffect(() => {
    if (!state.session) return;
    const id = window.setInterval(() => tick((n) => n + 1), 15000);
    return () => window.clearInterval(id);
  }, [state.session]);

  return (
    <header className="top">
      <div className="bar">
        <h1>
          <a href="#accueil">Builder Path</a>
        </h1>
        <span className="sub">Votre parcours en autonomie vers le métier de product builder IA</span>
        <div className="chrono">
          {state.session ? (
            <>
              <span className="live">Séance en cours, <span>{fmtMin(elapsed(state))}</span></span>
              <button className="btn" onClick={() => stopSession(moduleId)}>Terminer la séance</button>
            </>
          ) : (
            <>
              <span className="small muted">{fmtMin(weekMin(state))} cette semaine</span>
              <button className="btn" onClick={() => startSession(moduleId)}>Démarrer une séance</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
