// Progression de l'apprenant, persistée en localStorage (clé `builder-path-v1`).
// Le format est inchangé par rapport à la version HTML : une progression
// existante est relue telle quelle.

export type NoteKey = "got" | "stuck" | "change";
export const NOTE_KEYS: NoteKey[] = ["got", "stuck", "change"];

export interface QuizRun {
  i: number; // question courante
  answers: (number | undefined)[]; // index choisi par question
  checked: boolean; // la question courante a été vérifiée
}

export interface QuizState {
  best?: number;
  first?: number;
  attempts?: number;
  lastAnswers?: (number | undefined)[];
  run?: QuizRun | null;
}

export interface ExerciseState {
  criteria: boolean[];
  proof: string;
  status: "todo" | "validated";
  validatedAt?: string;
}

export interface Session {
  start: string; // ISO
  min: number;
  module: number | null;
}

export interface Progress {
  lessons: Record<string, boolean>;
  quiz: Record<number, QuizState>;
  exercises: Record<string, ExerciseState>;
  unlocked: Record<number, boolean>;
  notes: Record<number, Partial<Record<NoteKey, string>>>;
  sessions: Session[];
  session: { start: string; module: number | null } | null;
  goalH: number;
  ui: { lesson: Record<number, number> };
  last: string | null; // dernière modification « significative »
}

export const emptyProgress = (): Progress => ({
  lessons: {},
  quiz: {},
  exercises: {},
  unlocked: {},
  notes: {},
  sessions: [],
  session: null,
  goalH: 8,
  ui: { lesson: {} },
  last: null,
});

// Complète une progression partielle ou ancienne avec les valeurs par défaut.
export function normalize(raw: unknown): Progress {
  const d = emptyProgress();
  const s = (raw && typeof raw === "object" ? raw : {}) as Partial<Progress>;
  const out = { ...d } as Progress;
  for (const k of Object.keys(d) as (keyof Progress)[]) {
    const v = s[k];
    if (v !== undefined && (v !== null || k === "session" || k === "last")) (out as unknown as Record<string, unknown>)[k] = v;
  }
  if (!out.ui || typeof out.ui !== "object") out.ui = { lesson: {} };
  if (!out.ui.lesson) out.ui.lesson = {};
  return out;
}
