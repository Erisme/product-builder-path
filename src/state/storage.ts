import { normalize, type Progress } from "./types";

export const KEY = "builder-path-v1";

export function loadLocal(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch {
    /* stockage indisponible : on repart de zéro */
  }
  return normalize(null);
}

export function saveLocal(state: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota ou navigation privée : silencieux */
  }
}

// Sauvegarde distante optionnelle (runtime `window.claude` des artifacts).
// Absente en local ou sur GitHub Pages : l'app fonctionne avec localStorage seul.
interface RemoteDoc {
  get(): Promise<{ exists: boolean; data(): unknown }>;
  set(data: unknown): Promise<void>;
}
interface ClaudeRuntime {
  use(name: "db"): Promise<{ doc(path: string): RemoteDoc } | null>;
  use(name: "user"): Promise<{ id(): Promise<string> } | null>;
}
declare global {
  interface Window {
    claude?: ClaudeRuntime;
  }
}

// Renvoie le document distant et, s'il existe déjà, son contenu.
export async function connectRemote(): Promise<{ doc: RemoteDoc; data: Progress | null } | null> {
  try {
    const rt = window.claude;
    if (!rt || typeof rt.use !== "function") return null;
    const [db, user] = await Promise.all([rt.use("db"), rt.use("user")]);
    if (!db || !user) return null;
    const doc = db.doc("data/users/" + (await user.id()) + "/progress");
    const snap = await doc.get();
    return { doc, data: snap.exists ? normalize(snap.data()) : null };
  } catch {
    return null;
  }
}

export function saveRemote(doc: RemoteDoc, state: Progress) {
  doc.set(JSON.parse(JSON.stringify(state))).catch(() => {});
}
