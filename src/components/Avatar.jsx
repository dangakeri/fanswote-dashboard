const API_BASE = "https://fanswote.warcare.org.uk";

const palette = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-cyan-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-fuchsia-500",
  "bg-teal-500",
];

export function getInitials(name, username, fallback = "?") {
  const source = (name && name.trim()) || (username && username.replace(/^@/, "").trim()) || "";
  if (!source) return fallback;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function colorFor(seed) {
  const s = String(seed || "");
  let hash = 0;
  for (let i = 0; i < s.length; i += 1) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}

function resolveSrc(src) {
  if (!src) return null;
  if (src.startsWith("http") || src.startsWith("data:") || src.startsWith("blob:")) return src;
  return `${API_BASE}${src}`;
}

export default function Avatar({
  src,
  name,
  username,
  size = 36,
  className = "",
  tone = "primary",
}) {
  const resolved = resolveSrc(src);
  const initials = getInitials(name, username);
  const colorClass = tone === "primary" ? "bg-primary/10 text-primary" : `${colorFor(name || username || "?")} text-white`;

  const style = { width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.32)) };

  if (resolved) {
    return (
      <img
        src={resolved}
        alt={name || username || ""}
        style={style}
        className={`rounded-full object-cover shrink-0 ${className}`}
        onError={(e) => {
          e.currentTarget.style.display = "none";
          const sibling = e.currentTarget.nextElementSibling;
          if (sibling) sibling.style.display = "flex";
        }}
      />
    );
  }

  return (
    <span
      style={style}
      className={`rounded-full font-semibold flex items-center justify-center shrink-0 ${colorClass} ${className}`}
    >
      {initials}
    </span>
  );
}
