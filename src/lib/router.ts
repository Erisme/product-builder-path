// Routage par fragment d'URL, identique à la version HTML :
// #accueil, #outils, #outil-<slug>, #module-N, #module-N-(fiches|quiz|exercices|carnet).
import { useEffect, useState } from "react";
import { MODULES } from "../data/modules";
import { tool } from "../data/tools";
import type { Module, Tool } from "../data/types";

export type ModuleView = "apercu" | "fiches" | "quiz" | "exercices" | "carnet";
export type Route =
  | { view: "accueil"; key: "accueil"; m: null; tool?: undefined }
  | { view: "outils"; key: "outils"; m: null; tool?: undefined }
  | { view: "outil"; key: string; m: null; tool: Tool }
  | { view: ModuleView; key: string; m: Module; tool?: undefined };

const VIEWS: Exclude<ModuleView, "apercu">[] = ["fiches", "quiz", "exercices", "carnet"];

export function parse(hash: string): Route {
  const h = (hash || "#accueil").slice(1);
  for (const m of MODULES) {
    if (h === m.slug) return { m, view: "apercu", key: h };
    for (const v of VIEWS) if (h === m.slug + "-" + v) return { m, view: v, key: h };
  }
  if (h === "outils") return { m: null, view: "outils", key: "outils" };
  if (h.startsWith("outil-")) {
    const t = tool(h.slice(6));
    if (t) return { m: null, view: "outil", tool: t, key: h };
  }
  return { m: null, view: "accueil", key: "accueil" };
}

export function useRoute(): Route {
  const [hash, setHash] = useState(() => location.hash);
  useEffect(() => {
    const on = () => {
      setHash(location.hash);
      window.scrollTo({ top: 0 });
      document.getElementById("main")?.focus({ preventScroll: true });
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return parse(hash);
}

export function go(href: string) {
  if (location.hash !== href) location.hash = href;
}
