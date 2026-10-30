// Sauvegarde et restauration de la progression sous forme de fichier JSON.
import { normalize, type Progress } from "../state/types";

export const serialize = (s: Progress) => JSON.stringify(s, null, 2);

export function backupFilename(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `builder-path-progression-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.json`;
}

export function download(s: Progress) {
  const blob = new Blob([serialize(s)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = backupFilename();
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const KNOWN: (keyof Progress)[] = ["lessons", "quiz", "exercises", "notes", "sessions", "unlocked"];

// Relit un JSON exporté. Renvoie une erreur lisible si le contenu n'est pas une progression.
export function parseBackup(text: string): { ok: true; data: Progress } | { ok: false; error: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "Ce fichier n’est pas un JSON valide." };
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ok: false, error: "Ce fichier ne contient pas une progression Builder Path." };
  const o = raw as Record<string, unknown>;
  if (!KNOWN.some((k) => k in o)) return { ok: false, error: "Ce fichier ne contient pas une progression Builder Path." };
  for (const k of ["lessons", "quiz", "exercises", "notes", "unlocked"] as const) {
    if (o[k] !== undefined && (typeof o[k] !== "object" || o[k] === null || Array.isArray(o[k]))) return { ok: false, error: `Le champ « ${k} » est mal formé.` };
  }
  if (o.sessions !== undefined && !Array.isArray(o.sessions)) return { ok: false, error: "Le champ « sessions » est mal formé." };
  return { ok: true, data: normalize(raw) };
}

// Résumé court d'une progression, pour la confirmation avant restauration.
export function summary(s: Progress) {
  const lessons = Object.values(s.lessons).filter(Boolean).length;
  const ex = Object.values(s.exercises).filter((e) => e.status === "validated").length;
  const quiz = Object.values(s.quiz).filter((q) => q.best != null).length;
  const when = s.last ? new Date(s.last).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" }) : null;
  return { lessons, ex, quiz, when, empty: !s.last && !lessons && !ex && !quiz };
}
