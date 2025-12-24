type RetroHeaderProps = {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function RetroHeader({
  text,
  className = "",
  size = "md",
}: RetroHeaderProps) {
  const sizes =
    size === "lg"
      ? "h-14 md:h-20 text-4xl md:text-6xl"
      : size === "sm"
        ? "h-10 md:h-12 text-2xl md:text-3xl"
        : "h-12 md:h-16 text-3xl md:text-5xl";

  return (
    <div className={`retro-header w-full ${sizes} flex items-center justify-end pr-10 md:pr-6 ${className}`}>
      <span className="retro-header-text font-medium">{text}</span>
    </div>
  );
}
