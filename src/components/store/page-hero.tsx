import { SmartImage } from "@/components/ui/smart-image";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  tall = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  tall?: boolean;
}) {
  return (
    <section
      className={`relative overflow-hidden bg-inverse text-on-inverse ${tall ? "min-h-[58vh]" : "min-h-[48vh]"}`}
    >
      <SmartImage src={image} alt={imageAlt} fill priority className="object-cover opacity-45" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-inverse via-inverse/55 to-inverse/15" />
      <div className={`relative store-shell ${tall ? "py-24 lg:py-32" : "py-20 lg:py-28"}`}>
        <p className="text-sm tracking-[0.28em] text-on-inverse/70 uppercase">{eyebrow}</p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight md:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-inverse/80">{description}</p>
      </div>
    </section>
  );
}
