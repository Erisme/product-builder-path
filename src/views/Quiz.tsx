import { useState } from "react";
import type { Module } from "../data/types";
import { useStore } from "../state/store";
import { PASS } from "../lib/progress";

export function Quiz({ m }: { m: Module }) {
  const { state, update, toast } = useStore();
  const [err, setErr] = useState("");
  const q = state.quiz[m.id] || {};
  const run = q.run;

  const start = () => {
    setErr("");
    update((d) => {
      d.quiz[m.id] = { ...d.quiz[m.id], run: { i: 0, answers: [], checked: false } };
    }, false);
    window.scrollTo({ top: 0 });
  };

  if (run) {
    const item = m.quiz[run.i];
    const a = run.answers[run.i];
    const last = run.i === m.quiz.length - 1;
    const good = a === item.ok;

    const choose = (j: number) => {
      if (run.checked) return;
      setErr("");
      update((d) => {
        d.quiz[m.id].run!.answers[run.i] = j;
      }, false);
    };
    const check = () => {
      if (a == null) {
        setErr("Choisissez une réponse avant de vérifier.");
        document.querySelector<HTMLInputElement>('input[name="answer"]')?.focus();
        return;
      }
      update((d) => {
        d.quiz[m.id].run!.checked = true;
      }, false);
    };
    const next = () => {
      if (!last) {
        update((d) => {
          const r = d.quiz[m.id].run!;
          r.i++;
          r.checked = false;
        }, false);
        return;
      }
      const ok = m.quiz.filter((it, k) => run.answers[k] === it.ok).length;
      const score = Math.round((ok / m.quiz.length) * 100);
      update((d) => {
        const qq = d.quiz[m.id];
        qq.attempts = (qq.attempts || 0) + 1;
        if (qq.first == null) qq.first = score;
        qq.best = Math.max(qq.best || 0, score);
        qq.lastAnswers = run.answers;
        qq.run = null;
      });
      window.scrollTo({ top: 0 });
      toast(score >= PASS ? "Quiz réussi : " + score + " %" : "Score : " + score + " %");
    };
    const quit = () =>
      update((d) => {
        d.quiz[m.id].run = null;
      }, false);

    return (
      <section className="block">
        <p className="muted small">Question {run.i + 1} sur {m.quiz.length}</p>
        <div className="pager" aria-hidden="true">
          {m.quiz.map((x, k) => (
            <span key={k} className={k === run.i ? "here" : k < run.i ? (run.answers[k] === x.ok ? "read" : "") : ""}></span>
          ))}
        </div>
        <fieldset className="q">
          <legend>{item.q}</legend>
          {item.a.map((t, j) => {
            const cls = run.checked ? (j === item.ok ? "right" : j === a ? "wrong" : "") : "";
            return (
              <label className={"opt " + cls} key={j}>
                <input type="radio" name="answer" value={j} checked={a === j} disabled={run.checked} onChange={() => choose(j)} />
                <span>{t}</span>
              </label>
            );
          })}
        </fieldset>
        <div role="status">
          {run.checked && (
            <div className={"feedback" + (good ? "" : " bad")}>
              <strong>{good ? "Juste." : "Pas tout à fait."}</strong> {item.exp}
            </div>
          )}
        </div>
        <p className="err">{err}</p>
        <div className="row">
          {run.checked ? (
            <button className="btn main" onClick={next}>{last ? "Voir mon score" : "Question suivante"}</button>
          ) : (
            <button className="btn main" onClick={check}>Vérifier</button>
          )}
          <button className="btn link" onClick={quit}>Arrêter le quiz</button>
        </div>
      </section>
    );
  }

  if (q.lastAnswers) {
    const la = q.lastAnswers;
    const ok = m.quiz.filter((it, k) => la[k] === it.ok).length;
    const score = Math.round((ok / m.quiz.length) * 100);
    const missed = m.quiz.map((it, k) => ({ it, k })).filter((x) => la[x.k] !== x.it.ok);
    const pass = (q.best || 0) >= PASS;
    return (
      <section className="block">
        <h2>Quiz : {m.title}</h2>
        <p>
          <span className="bigfig">{score} %</span> <span className="muted">{ok} sur {m.quiz.length} au dernier essai</span>
        </p>
        <p>
          {q.first != null && (q.attempts || 0) > 1 ? `Premier essai ${q.first} %, meilleur score ${q.best} %, ${q.attempts} essais.` : `Meilleur score ${q.best} %.`}
          {pass ? <> <span className="tag ok">Étape suivante ouverte</span></> : <> Il faut {PASS} % pour ouvrir l’étape suivante.</>}
        </p>
        {missed.length ? (
          <>
            <h3>À revoir</h3>
            <ul className="plain">
              {missed.map((x) => (
                <li key={x.k}>
                  <span>
                    <strong>{x.it.q}</strong>
                    <br />
                    {x.it.a[x.it.ok]}
                    <br />
                    <span className="small muted">{x.it.exp}</span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Aucune erreur.</p>
        )}
        <div className="row" style={{ marginTop: 16 }}>
          <button className={"btn" + (pass ? "" : " main")} onClick={start}>Refaire le quiz</button>
          {pass ? (
            <a className="btn main" href={"#" + m.slug + "-exercices"}>Passer aux exercices</a>
          ) : (
            <a className="btn" href={"#" + m.slug + "-fiches"}>Relire les fiches</a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="block">
      <h2>Quiz : {m.title}</h2>
      <p>{m.quiz.length} questions, une à la fois, avec l’explication juste après votre réponse. Comptez {m.quiz.length * 2} minutes.</p>
      <p className="muted">Votre premier essai est gardé comme point de départ ; seul le meilleur score compte pour avancer.</p>
      <button className="btn main" onClick={start}>Commencer</button>
    </section>
  );
}
