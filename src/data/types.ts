// Contenu pédagogique (constantes MODULES et TOOLS, cf. data/modules.ts et data/tools.ts).

export interface Lesson {
  id: string;
  title: string;
  body: string[];
  sources: [label: string, url: string][];
}

export interface QuizItem {
  q: string;
  a: string[];
  ok: number; // index de la bonne réponse dans `a`
  exp: string;
}

export interface Exercise {
  id: string;
  title: string;
  tool: string;
  time: string;
  brief: string;
  criteria: string[];
  proof: string;
}

export interface Module {
  id: number; // 1..5, aussi utilisé comme clé dans l'état
  slug: string;
  title: string;
  hours: string;
  goal: string;
  lessons: Lesson[];
  quiz: QuizItem[];
  exercises: Exercise[];
}

export interface ToolExample {
  t: string;
  flow: string[];
  d: string;
}

export interface Tool {
  slug: string;
  name: string;
  cat: string;
  step: number; // module où l'outil est abordé
  doc: string;
  what: string;
  examples: ToolExample[];
  try: string;
  use: string;
  avoid: string;
}
