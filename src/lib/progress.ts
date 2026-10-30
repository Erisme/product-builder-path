// Sélecteurs purs sur la progression (même logique que la version HTML).
import { MODULES } from "../data/modules";
import type { Module } from "../data/types";
import { NOTE_KEYS, type ExerciseState, type Progress } from "../state/types";

export const PASS = 80;

export const best = (s: Progress, m: Module) => s.quiz[m.id]?.best || 0;
export const passed = (s: Progress, m: Module) => best(s, m) >= PASS;

export const emptyEx = (): ExerciseState => ({ criteria: [], proof: "", status: "todo" });
export const exState = (s: Progress, id: string): ExerciseState => s.exercises[id] ?? emptyEx();
// Variante pour les brouillons mutables : crée l'entrée si besoin.
export const ensureEx = (d: Progress, id: string): ExerciseState => (d.exercises[id] ??= emptyEx());

export const isValid = (s: Progress, e: { id: string }) => s.exercises[e.id]?.status === "validated";
export const validatedCount = (s: Progress, m: Module) => m.exercises.filter((e) => isValid(s, e)).length;
export const lessonsRead = (s: Progress, m: Module) => m.lessons.filter((l) => s.lessons[l.id]).length;
export const noteDone = (s: Progress, m: Module) => {
  const n = s.notes[m.id] || {};
  return NOTE_KEYS.every((k) => (n[k] || "").trim());
};
export const isUnlocked = (s: Progress, m: Module) => m.id === 1 || !!s.unlocked[m.id] || passed(s, MODULES[m.id - 2]);
export const isDone = (s: Progress, m: Module) => passed(s, m) && validatedCount(s, m) === m.exercises.length;

export const TOTAL = MODULES.reduce((n, m) => n + m.exercises.length, 0);
export const built = (s: Progress) => MODULES.reduce((n, m) => n + validatedCount(s, m), 0);

export const fmtMin = (n: number) => (n < 60 ? n + " min" : Math.floor(n / 60) + " h " + String(n % 60).padStart(2, "0"));

export function weekStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}
export const weekMin = (s: Progress) => {
  const ws = weekStart();
  return s.sessions.filter((x) => new Date(x.start) >= ws).reduce((a, x) => a + x.min, 0);
};
export const elapsed = (s: Progress) =>
  s.session ? Math.max(0, Math.round((Date.now() - new Date(s.session.start).getTime()) / 60000)) : 0;

export interface NextAction {
  m: Module;
  what: string;
  time: string;
  href: string;
  lesson?: number;
}
export function nextAction(s: Progress): NextAction | null {
  for (const m of MODULES) {
    if (!isUnlocked(s, m)) continue;
    const i = m.lessons.findIndex((l) => !s.lessons[l.id]);
    if (i >= 0) return { m, what: "Lire la fiche « " + m.lessons[i].title + " »", time: "15 min", href: "#" + m.slug + "-fiches", lesson: i };
    if (!passed(s, m)) return { m, what: "Réussir le quiz du module", time: m.quiz.length * 2 + " min", href: "#" + m.slug + "-quiz" };
    const e = m.exercises.find((x) => !isValid(s, x));
    if (e) return { m, what: e.title, time: e.time, href: "#" + m.slug + "-exercices" };
    if (!noteDone(s, m)) return { m, what: "Écrire la rétro du module dans votre carnet", time: "10 min", href: "#" + m.slug + "-carnet" };
  }
  return null;
}

export interface Step {
  v: "fiches" | "quiz" | "exercices" | "carnet";
  name: string;
  status: string;
  done: boolean;
  d: string;
}
export const steps = (s: Progress, m: Module): Step[] => [
  { v: "fiches", name: "Fiches", status: lessonsRead(s, m) + "/" + m.lessons.length, done: lessonsRead(s, m) === m.lessons.length, d: m.lessons.length + " fiches courtes avec leurs sources" },
  { v: "quiz", name: "Quiz", status: best(s, m) ? best(s, m) + " %" : "à faire", done: passed(s, m), d: m.quiz.length + " questions, " + PASS + " % pour ouvrir l’étape suivante" },
  { v: "exercices", name: "Exercices", status: validatedCount(s, m) + "/" + m.exercises.length, done: validatedCount(s, m) === m.exercises.length, d: "Sur les vrais outils, validés par une preuve" },
  { v: "carnet", name: "Carnet", status: noteDone(s, m) ? "écrit" : "à écrire", done: noteDone(s, m), d: "Trois questions pour faire le point seul" },
];

// Avancement global d'une étape, en pourcentage (barre de l'aperçu).
export const modulePercent = (s: Progress, m: Module) =>
  Math.round(((lessonsRead(s, m) + (passed(s, m) ? 1 : 0) + validatedCount(s, m) + (noteDone(s, m) ? 1 : 0)) / (m.lessons.length + m.exercises.length + 2)) * 100);
