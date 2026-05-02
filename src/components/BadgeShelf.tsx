export const BadgeShelf = ({ badges }: { badges: string[] }) => (
  <section className="card"><h3>Badges</h3><div className="badges">{badges.length?badges.map((b)=><span key={b}>🏅 {b}</span>):<span>No badges yet.</span>}</div></section>
);
