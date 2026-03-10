export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-light text-primary-dark">
        {title}
      </h2>
      {subtitle && (
        <p className="text-foreground/60 mt-3 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="w-16 h-0.5 bg-accent mx-auto mt-4" />
    </div>
  );
}
