import { home } from "@/content/home";

export function CompanyStats() {
  return (
    <dl className="company-stats">
      {home.stats.map((stat) => (
        <div key={stat.label}>
          <dt>{stat.label}</dt>
          <dd>{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
