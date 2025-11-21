type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "none";
  className?: string;
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  className,
  disabled = false,
  ...props
}: ButtonProps) {
  const baseStyle =
    "p-3 rounded font-light transition-colors duration-300 focus:outline-none";

  let variantStyle = "";
  switch (variant) {
    case "primary":
      variantStyle =
        "bg-[#091b05]  hover:bg-[#091b05]/80 active:bg-[#050f03] disabled:bg-[#091b05]/50";
      break;
    case "secondary":
      variantStyle =
        "bg-[#fff]/10 border  hover:bg-[#fff]/20 active:bg-[#fff]/30 disabled:bg-gray-900/70";
      break;
    case "none":
      variantStyle = "";
      break;
  }
  return (
    <div>
      <button
        onClick={onClick}
        className={`${baseStyle} ${variantStyle} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
