import { TOOLS } from "../data/tools";
import { ToolCard } from "../components/ToolBits";

export function Tools() {
  const sorted = [...TOOLS].sort((a, b) => a.step - b.step);
  return (
    <section className="block">
      <h2>Boîte à outils</h2>
      <p>À quoi sert chaque outil du parcours, avec des exemples tirés du quotidien d’une agence digitale, un essai de 15 minutes et les cas où il vaut mieux s’en passer.</p>
      <div className="tools">
        {sorted.map((x) => (
          <ToolCard key={x.slug} slug={x.slug} />
        ))}
      </div>
    </section>
  );
}
