// Store React : progression + persistance locale (et distante si disponible) + toasts.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { connectRemote, loadLocal, saveLocal, saveRemote } from "./storage";
import type { Progress } from "./types";
import { fmtMin } from "../lib/progress";

type Mutator = (draft: Progress) => void;

interface Store {
  state: Progress;
  /** Applique une mutation sur une copie de l'état. `touch` met à jour la date de dernière modification. */
  update: (fn: Mutator, touch?: boolean) => void;
  /** Remplace toute la progression (restauration d'une sauvegarde). */
  replace: (next: Progress) => void;
  toast: (msg: string) => void;
  toastMsg: string | null;
  startSession: (moduleId: number | null) => void;
  stopSession: (fallbackModule: number | null) => void;
}

const Ctx = createContext<Store | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Progress>(loadLocal);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const remote = useRef<Awaited<ReturnType<typeof connectRemote>>>(null);
  const remoteTimer = useRef<number | undefined>(undefined);

  const update = useCallback((fn: Mutator, touch = true) => {
    setState((prev) => {
      const next = structuredClone(prev);
      fn(next);
      if (touch) next.last = new Date().toISOString();
      return next;
    });
  }, []);

  const replace = useCallback((next: Progress) => setState(structuredClone(next)), []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2400);
  }, []);

  // Persistance : locale à chaque changement, distante avec un léger délai.
  useEffect(() => {
    saveLocal(state);
    const r = remote.current;
    if (r) {
      window.clearTimeout(remoteTimer.current);
      remoteTimer.current = window.setTimeout(() => saveRemote(r.doc, state), 700);
    }
  }, [state]);

  // Connexion distante optionnelle (runtime des artifacts). Absente en local.
  useEffect(() => {
    let alive = true;
    connectRemote().then((r) => {
      if (!alive || !r) return;
      remote.current = r;
      if (r.data) setState(r.data);
      else setState((s) => (s.last ? (saveRemote(r.doc, s), s) : s));
    });
    return () => {
      alive = false;
    };
  }, []);

  const startSession = useCallback(
    (moduleId: number | null) => {
      update((d) => {
        d.session = { start: new Date().toISOString(), module: moduleId };
      });
      toast("Séance démarrée");
    },
    [update, toast],
  );

  const stopSession = useCallback(
    (fallbackModule: number | null) => {
      const s = state.session;
      if (!s) return;
      const min = Math.min(240, Math.max(0, Math.round((Date.now() - new Date(s.start).getTime()) / 60000)));
      update((d) => {
        if (min >= 1) d.sessions.push({ start: s.start, min, module: s.module || fallbackModule });
        d.session = null;
      });
      toast(min >= 1 ? "Séance enregistrée : " + fmtMin(min) : "Séance de moins d’une minute, non comptée");
    },
    [state.session, update, toast],
  );

  return <Ctx.Provider value={{ state, update, replace, toast, toastMsg, startSession, stopSession }}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore hors du ProgressProvider");
  return s;
}
