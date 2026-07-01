// Brand assets copied from the main Fanswote app (public/favicon.svg, public/logo.svg).

// Square brand mark — safe on light, dark, and colored backgrounds.
export function LogoMark({ size = 32, className = "" }) {
  return (
    <img
      src="/favicon.svg"
      alt="Fanswote"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`object-contain ${className}`}
    />
  );
}

// Full wordmark (598×117). Set height via className, e.g. "h-7".
export function LogoWordmark({ className = "h-7" }) {
  return <img src="/logo.svg" alt="Fanswote" className={`w-auto object-contain ${className}`} />;
}

export default LogoMark;
