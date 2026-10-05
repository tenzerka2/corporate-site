import { labels } from "@/content/labels";
import Link from "next/link";
import { ArrowUpRight, Calculator } from "lucide-react";
import { Logo } from "./Logo";
import { ButtonLink, Container } from "./ui";
import {
  clientLinks,
  companyLinks,
  copy,
  legalLinks,
  site,
  socialLinks,
} from "@/content/site";
export function Footer() {
  return (
    <footer className="site-footer">
      <Container wide>
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" aria-label={labels.onegaGlavnaya}>
              <Logo dark />
            </Link>
            <p>{site.description}</p>
            <span className="footer-phone">{site.phone}</span>
            <span>{site.email}</span>
            <ButtonLink href="/calculator" icon={<Calculator size={19} />}>
              {labels.rasschitatDostavku}
            </ButtonLink>
          </div>
          {[
            { title: labels.kompaniya, links: companyLinks },
            { title: labels.klientam, links: clientLinks },
            { title: labels.myVSeti, links: socialLinks },
          ].map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2>{group.title}</h2>
              {group.links.map((link) => (
                <Link href={link.href} key={link.href}>
                  {link.title}
                  {group.title === labels.myVSeti && <ArrowUpRight size={15} />}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className="footer-legal">
          {legalLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.title}
            </Link>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 {site.legalName}</span>
          <span>{copy.demoNote}</span>
          <a
            className="demo-badge"
            href="https://shvetsov.studio"
            target="_blank"
            rel="noreferrer"
          >
            {site.demo}
            <ArrowUpRight size={15} />
          </a>
        </div>
      </Container>
    </footer>
  );
}
