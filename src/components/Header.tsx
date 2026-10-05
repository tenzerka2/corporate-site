"use client";
import { labels } from "@/content/labels";
import Link from "next/link";
import Image from "next/image";
import { photoAssets } from "@/content/visuals";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  autoUpdate,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Calculator,
  ChevronDown,
  Menu,
  PackageSearch,
  Package,
  Truck,
  UserRound,
  Warehouse,
  X,
} from "lucide-react";
import { ButtonLink, Container } from "./ui";
import { Logo } from "./Logo";
import {
  clientLinks,
  companyLinks,
  copy,
  services,
  site,
  utilityLinks,
} from "@/content/site";
const serviceIcons = {
  packages: Package,
  truck: Truck,
  warehouse: Warehouse,
  box: Box,
};
export function Header() {
  const [panel, setPanel] = useState<"services" | "why" | "full" | null>(null);
  const [compact, setCompact] = useState(false);
  const header = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { refs, floatingStyles, context } = useFloating({
    open: panel !== null,
    onOpenChange: (open) => {
      if (!open) setPanel(null);
    },
    placement: "bottom-start",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [offset(24), shift({ padding: 24 })],
  });
  const setFloating = refs.setFloating;
  const setReference = refs.setReference;
  const { getFloatingProps } = useInteractions([
    useDismiss(context),
    useRole(context, { role: "dialog" }),
  ]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setCompact(window.scrollY > 32));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);
  useEffect(() => {
    if (panel !== "full") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [panel]);
  function toggle(next: typeof panel, trigger: HTMLButtonElement) {
    setReference(trigger);
    setPanel(panel === next ? null : next);
  }
  function close() {
    setPanel(null);
  }
  return (
    <>
      <header
        ref={header}
        className={`site-header ${compact ? "compact" : ""}`}
      >
        <Container wide className="header-inner">
          <div className="brand-group">
            <button
              className="icon-button"
              aria-label={labels.otkrytPolnoeMenyu}
              aria-expanded={panel === "full"}
              aria-controls={panel === "full" ? "site-menu" : undefined}
              onClick={(e) => toggle("full", e.currentTarget)}
            >
              <Menu size={24} />
            </button>
            <Link href="/" aria-label={labels.onegaGlavnaya} onClick={close}>
              <Logo />
            </Link>
          </div>
          <nav className="desktop-nav" aria-label={labels.osnovnayaNavigatsiya}>
            <button
              aria-expanded={panel === "services"}
              aria-controls={panel === "services" ? "site-menu" : undefined}
              onClick={(e) => toggle("services", e.currentTarget)}
            >
              {labels.uslugi}
              <ChevronDown size={15} />
            </button>
            <button
              aria-expanded={panel === "why"}
              aria-controls={panel === "why" ? "site-menu" : undefined}
              onClick={(e) => toggle("why", e.currentTarget)}
            >
              {labels.pochemuMy}
              <ChevronDown size={15} />
            </button>
            <Link href="/directions">{labels.napravleniya}</Link>
            <Link href="/tariffs">{labels.tarify}</Link>
          </nav>
          <div className="header-actions">
            <ButtonLink
              href="/calculator"
              variant="secondary"
              size="small"
              icon={<Calculator size={18} />}
              className="desktop-calculate"
            >
              {labels.rasschitatDostavku}
            </ButtonLink>
            <Link className="header-tool" href="/tracking">
              <PackageSearch size={22} />
              <span>{labels.otsledit}</span>
            </Link>
            <Link className="header-tool" href="/account">
              <UserRound size={22} />
              <span>{labels.kabinet}</span>
            </Link>
            <span
              className="header-phone"
              title={labels.vymyshlennyyTelefonDemoKompanii}
            >
              {site.phone}
            </span>
            <ButtonLink
              className="mobile-calculate"
              href="/calculator"
              size="small"
            >
              {labels.rasschitat}
            </ButtonLink>
          </div>
        </Container>
      </header>
      <AnimatePresence>
        {panel && (
          <FloatingPortal>
            <FloatingFocusManager context={context} modal returnFocus>
              <motion.div
                ref={(node) => setFloating(node)}
                {...getFloatingProps()}
                id="site-menu"
                aria-label={
                  panel === "services"
                    ? labels.uslugi
                    : panel === "why"
                      ? labels.pochemuMy
                      : labels.polnoeMenyu
                }
                className={`nav-layer nav-${panel} ${compact ? "is-compact" : ""}`}
                style={panel === "why" ? floatingStyles : undefined}
                initial={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
              >
                {panel === "services" && (
                  <Container wide>
                    <div className="menu-heading">
                      <span>{labels.vyberiteFormatPerevozki}</span>
                      <button
                        className="icon-button"
                        aria-label={labels.zakrytMenyuUslug}
                        onClick={close}
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="mega-grid">
                      {services.map((service) => {
                        const Icon = serviceIcons[service.icon];
                        return (
                          <div className="mega-column" key={service.href}>
                            <Icon size={32} strokeWidth={1.4} />
                            <Link
                              className="mega-title"
                              href={service.href}
                              onClick={close}
                            >
                              {service.title}
                            </Link>
                            <p>{service.description}</p>
                            <Link
                              className="text-link"
                              href={service.href}
                              onClick={close}
                            >
                              {labels.podrobnee}
                              <ArrowRight size={17} />
                            </Link>
                            <ButtonLink
                              href={`/calculator?service=${service.icon}`}
                              variant="secondary"
                              size="small"
                              onClick={close}
                            >
                              {service.action}
                            </ButtonLink>
                          </div>
                        );
                      })}
                    </div>
                    <div className="menu-bottom">
                      <span>
                        {labels.pomozhemVybratPodhodyaschiyFormatDostavki}
                      </span>
                      <Link className="text-link" href="/help" onClick={close}>
                        {labels.voprosyIPomosch}
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </Container>
                )}
                {panel === "why" && (
                  <>
                    <div className="menu-heading">
                      <span>{labels.pochemuMy}</span>
                      <button
                        className="icon-button"
                        aria-label={labels.zakrytMenyu}
                        onClick={close}
                      >
                        <X size={18} />
                      </button>
                    </div>
                    {companyLinks.map((link) => (
                      <Link
                        className="why-link"
                        href={link.href}
                        key={link.href}
                        onClick={close}
                      >
                        {link.title}
                        <ArrowUpRight size={16} />
                      </Link>
                    ))}
                  </>
                )}
                {panel === "full" && (
                  <Container wide>
                    <div className="full-menu-top">
                      <Link
                        href="/"
                        onClick={close}
                        aria-label={labels.onegaGlavnaya}
                      >
                        <Logo />
                      </Link>
                      <button
                        className="icon-button"
                        aria-label={labels.zakrytPolnoeMenyu}
                        onClick={close}
                      >
                        <X size={26} />
                      </button>
                    </div>
                    <div className="full-grid">
                      <div className="full-actions">
                        {utilityLinks.map((link, index) => (
                          <ButtonLink
                            key={link.href}
                            href={link.href}
                            onClick={close}
                            variant={index === 0 ? "primary" : "secondary"}
                            icon={
                              index === 0 ? (
                                <Calculator size={19} />
                              ) : index === 1 ? (
                                <PackageSearch size={19} />
                              ) : index === 2 ? (
                                <UserRound size={19} />
                              ) : undefined
                            }
                          >
                            {link.title}
                          </ButtonLink>
                        ))}
                        <div className="full-contact">
                          <strong>{site.phone}</strong>
                          <span>{site.email}</span>
                          <small>{copy.demoNote}</small>
                        </div>
                      </div>
                      <nav
                        className="full-sections"
                        aria-label={labels.vseRazdely}
                      >
                        <h2>{labels.uslugi}</h2>
                        {services.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={close}
                          >
                            {link.title}
                            <ArrowUpRight size={18} />
                          </Link>
                        ))}
                        <div className="full-secondary">
                          {[
                            ...clientLinks.filter(
                              (l) => l.href !== "/tracking",
                            ),
                            ...companyLinks,
                          ].map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={close}
                            >
                              {link.title}
                            </Link>
                          ))}
                        </div>
                      </nav>
                      <div className="full-about">
                        <h2>{labels.oKompanii}</h2>
                        <Image className="menu-fleet-photo" src="/images/photos/fleet.webp" alt={photoAssets[8].title} width={1920} height={1080} sizes="400px" />
                        <blockquote>{copy.aboutQuote}</blockquote>
                        <p className="caption muted">{copy.quoteCaption}</p>
                        <Link
                          className="text-link"
                          href="/about"
                          onClick={close}
                        >
                          {labels.poznakomitsyaSNami}
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    </div>
                    <div className="full-menu-bottom">
                      <span>{site.description}</span>
                      <a
                        href="https://shvetsov.studio"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {site.demo}
                        <ArrowUpRight size={16} />
                      </a>
                    </div>
                  </Container>
                )}
              </motion.div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
}
