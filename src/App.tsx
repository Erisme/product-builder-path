import { useEffect } from "react";
import { ProgressProvider, useStore } from "./state/store";
import { useRoute, type Route } from "./lib/router";
import { isUnlocked } from "./lib/progress";
import { Header } from "./components/Header";
import { Trail } from "./components/Trail";
import { Toast } from "./components/Toast";
import { Home } from "./views/Home";
import { Tools } from "./views/Tools";
import { ToolDetail } from "./views/ToolDetail";
import { Locked } from "./views/Locked";
import { Overview } from "./views/Overview";
import { Lessons } from "./views/Lessons";
import { Quiz } from "./views/Quiz";
import { Exercises } from "./views/Exercises";
import { Notebook } from "./views/Notebook";

function Main({ route }: { route: Route }) {
  const { state } = useStore();
  if (route.view === "accueil") return <Home />;
  if (route.view === "outils") return <Tools />;
  if (route.view === "outil") return <ToolDetail x={route.tool} />;
  const m = route.m;
  if (!isUnlocked(state, m)) return <Locked m={m} />;
  switch (route.view) {
    case "apercu":
      return <Overview m={m} />;
    case "fiches":
      return <Lessons key={m.id} m={m} />;
    case "quiz":
      return <Quiz key={m.id} m={m} />;
    case "exercices":
      return <Exercises key={m.id} m={m} />;
    case "carnet":
      return <Notebook key={m.id} m={m} />;
  }
}

function Shell() {
  const route = useRoute();
  useEffect(() => {
    const name = route.m ? route.m.title : route.tool ? route.tool.name : route.view === "outils" ? "Boîte à outils" : "Tableau de bord";
    document.title = name + " · Builder Path";
  }, [route]);
  return (
    <>
      <a className="skip" href="#main">Aller au contenu</a>
      <Header moduleId={route.m?.id ?? null} />
      <div className="layout">
        <Trail route={route} />
        <main id="main" tabIndex={-1}>
          <Main route={route} />
        </main>
      </div>
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <Shell />
    </ProgressProvider>
  );
}
