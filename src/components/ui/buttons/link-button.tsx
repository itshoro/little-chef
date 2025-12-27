import type { Route } from "next";
import Link from "next/link";

interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: Route;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  external?: boolean;
}

export function LinkButton({
  variant = "primary",
  size = "md",
  children,
  className = "",
  external = false,
  ...props
}: LinkButtonProps) {
  const baseClasses = `
    relative inline-flex items-center justify-center gap-2
    font-medium rounded-full
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-900
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
    bg-lime-300 hover:bg-lime-700 
    text-black 
    focus:ring-lime-300
  `,
    secondary: `
    bg-stone-200 hover:bg-stone-400 
    text-black 
    focus:ring-stone-200
  `,
    outline: `
    bg-transparent border border-white/20 hover:bg-white/5 
    text-white 
    focus:ring-white/30
  `,
    ghost: `
    bg-transparent hover:bg-white/5 
    text-white 
    focus:ring-white/30
  `,
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const externalProps = external
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  const finalProps = {
    className: `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`,
    ...externalProps,
    ...props,
  };

  if (external) {
    return (
      <a {...finalProps}>
        <div className="absolute -z-10 hidden size-[max(48px,100%)] pointer-coarse:block" />
        {children}
      </a>
    );
  }

  return (
    <Link {...finalProps}>
      <div className="absolute -z-10 hidden size-[max(48px,100%)] pointer-coarse:block" />
      {children}
    </Link>
  );
}
