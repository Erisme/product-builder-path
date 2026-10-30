// Section « Sauvegarde » du tableau de bord : exporter et restaurer sa progression.
import { useRef, useState } from "react";
import { useStore } from "../state/store";
import { download, parseBackup, serialize, summary } from "../lib/backup";
import type { Progress } from "../state/types";

export function Backup() {
  const { state, replace, toast } = useStore();
  const [err, setErr] = useState("");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasted, setPasted] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const cur = summary(state);

  const copy = () => {
    const txt = serialize(state);
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(
      () => toast("Progression copiée"),
      () => prompt("Copiez votre progression :", txt),
    );
  };

  const restore = (text: string) => {
    setErr("");
    const r = parseBackup(text);
    if (!r.ok) {
      setErr(r.error);
      return;
    }
    const inc = summary(r.data);
    const desc = `${inc.lessons} fiche${inc.lessons > 1 ? "s" : ""} lue${inc.lessons > 1 ? "s" : ""}, ${inc.quiz} quiz, ${inc.ex} exercice${inc.ex > 1 ? "s" : ""} validé${inc.ex > 1 ? "s" : ""}${inc.when ? `, enregistrée le ${inc.when}` : ""}`;
    const msg = cur.empty
      ? `Restaurer cette progression ? (${desc})`
      : `Remplacer la progression de ce navigateur par la sauvegarde ? (${desc})\n\nVotre progression actuelle sera perdue si vous ne l’avez pas exportée.`;
    if (!confirm(msg)) return;
    replace(r.data as Progress);
    setPasted("");
    setPasteOpen(false);
    toast("Progression restaurée");
    window.scrollTo({ top: 0 });
  };

  const onFile = (f: File | undefined) => {
    if (!f) return;
    f.text().then(restore, () => setErr("Impossible de lire ce fichier."));
    if (file.current) file.current.value = "";
  };

  return (
    <section className="block" aria-labelledby="h-save">
      <h2 id="h-save">Sauvegarde</h2>
      <p className="muted">
        Votre avancement est enregistré automatiquement dans ce navigateur
        {cur.when ? <>, dernière modification le {cur.when}</> : null}. Pour le reprendre sur un autre appareil ou le garder au chaud, exportez-le dans un fichier, puis restaurez-le là où vous reprenez.
      </p>
      <div className="row">
        <button className="btn main" onClick={() => download(state)} disabled={cur.empty}>Télécharger ma progression</button>
        <button className="btn" onClick={copy} disabled={cur.empty}>Copier le JSON</button>
      </div>
      <h3>Reprendre une sauvegarde</h3>
      <div className="row">
        <button className="btn" onClick={() => file.current?.click()}>Choisir un fichier…</button>
        <input ref={file} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => onFile(e.target.files?.[0])} />
        <button className="btn link" aria-expanded={pasteOpen} onClick={() => setPasteOpen((v) => !v)}>
          {pasteOpen ? "Fermer" : "Coller un JSON"}
        </button>
      </div>
      {pasteOpen && (
        <div style={{ marginTop: 12 }}>
          <label htmlFor="paste" className="small muted" style={{ display: "block", marginBottom: 4 }}>Collez ici le contenu d’une sauvegarde</label>
          <textarea id="paste" className="field" value={pasted} onChange={(e) => setPasted(e.target.value)} spellCheck={false} />
          <p style={{ marginTop: 8 }}>
            <button className="btn main" disabled={!pasted.trim()} onClick={() => restore(pasted)}>Restaurer</button>
          </p>
        </div>
      )}
      <p className="err" role="alert">{err}</p>
    </section>
  );
}
