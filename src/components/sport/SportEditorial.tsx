import type { SportConfig } from "@/lib/sports";

interface Props {
  sport: SportConfig;
}

export const SportEditorial = ({ sport }: Props) => (
  <section className="bg-white py-16">
    <div className="mx-auto px-6 lg:px-10 max-w-[760px] space-y-12">
      {sport.editorial.map((block) => (
        <article key={block.heading} className="space-y-4">
          <header className="space-y-3">
            <h3 className="font-bold text-[24px] text-dark leading-tight">{block.heading}</h3>
            <span
              aria-hidden
              className="block h-[3px] w-10 rounded-full"
              style={{ backgroundColor: sport.hex }}
            />
          </header>
          {block.paragraphs.map((p, i) => (
            <p key={i} className="text-[16px] text-dark leading-[1.7]">
              {p}
            </p>
          ))}
        </article>
      ))}
    </div>
  </section>
);
