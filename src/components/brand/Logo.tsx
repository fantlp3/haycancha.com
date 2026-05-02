interface LogoProps {
  variant?: "light" | "dark";
  size?: number;
}

export const Logo = ({ variant = "light", size = 28 }: LogoProps) => {
  const color = variant === "light" ? "text-white" : "text-dark";
  return (
    <span
      className={`font-display ${color} leading-none select-none`}
      style={{ fontSize: size }}
    >
      HayCancha<span className="text-orange">.</span>
    </span>
  );
};
