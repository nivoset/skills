export type Crumb = { name: string; href: string };

export default function TopBar({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <div className="topbar">
      <div className="brand">
        <span className="mark">Atlas</span>
        <span className="tag">POC &middot; fake repo</span>
      </div>

      <nav className="breadcrumb">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={c.href} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              {i > 0 && <span className="sep">/</span>}
              {isLast ? (
                <span className="current">{c.name}</span>
              ) : (
                <a href={c.href}>{c.name}</a>
              )}
            </span>
          );
        })}
      </nav>

      <div className="legend-bar">
        <span className="legend-chip">
          <span className="legend-dot solid" /> solid
        </span>
        <span className="legend-chip">
          <span className="legend-dot refine" /> needs refinement
        </span>
        <span className="legend-chip">
          <span className="legend-dot none" /> not started
        </span>
      </div>
    </div>
  );
}
