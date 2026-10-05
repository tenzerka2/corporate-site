"use client";
import { labels } from "@/content/labels";
import { useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  CheckItem,
  Field,
  Input,
  Section,
  Stat,
  Textarea,
} from "./ui";
import { Accordion, Select, Tabs } from "./ui/interactive";
import { Logo } from "./Logo";
import { services } from "@/content/site";
import { uiContent } from "@/content/ui";
export function UiShowcase() {
  const [city, setCity] = useState<string>(labels.moskva);
  const [format, setFormat] = useState("pallet");
  return (
    <>
      <Section
        id="brand"
        title={labels.logotipIPalitra}
        subtitle={labels.znakObedinyaetDvizhenieDorogiIPlavnye}
      >
        <div className="logo-samples">
          <div>
            <Logo />
            <span>{labels.naSvetlomFone}</span>
          </div>
          <div className="dark-sample">
            <Logo dark />
            <span>{labels.naTyomnomFone}</span>
          </div>
          <div>
            <Logo markOnly />
            <span>{labels.tolkoZnak}</span>
          </div>
        </div>
        <div className="swatch-grid">
          {uiContent.colors.map((color) => (
            <div key={color.value}>
              <div className="swatch" style={{ background: color.value }} />
              <strong>{color.label}</strong>
              <span>{color.value}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section
        id="type"
        title={labels.tipografika}
        subtitle={labels.interChetyreNachertaniyaTsifryIspolzuyutTablichnuyu}
      >
        <div className="type-sample">
          <span className="caption muted">H1 · 60/66 · 600</span>
          <p className="display-text">{labels.dvizhenieVashegoBiznesa}</p>
        </div>
        <div className="type-sample">
          <span className="caption muted">H2 · 40/48 · 600</span>
          <p className="h2-text">{labels.kazhdayaPostavkaPodKontrolem}</p>
        </div>
        <div className="type-sample">
          <span className="caption muted">{labels.podzagolovok2634600}</span>
          <p className="hero-subtitle">
            {labels.dostavkaOtSkladaDoPoluchatelya}
          </p>
        </div>
        <div className="type-sample">
          <span className="caption muted">H3 · 22/30 · 600</span>
          <p className="h3-text">{labels.sbornyeGruzy}</p>
        </div>
        <div className="type-sample">
          <span className="caption muted">{labels.tekst1828400}</span>
          <p className="lead measure">
            {labels.myPodbiraemFormatPerevozkiPodObyom}
          </p>
        </div>
        <div className="type-sample">
          <span className="caption muted">{labels.tekst1624400}</span>
          <p>{labels.svedeniyaOPerevozkeSobranyVOdnom}</p>
        </div>
        <div className="type-sample">
          <span className="caption muted">{labels.podpis1420500}</span>
          <p className="caption">{labels.demonstratsionnyeDannye}</p>
        </div>
      </Section>
      <Section id="controls" title={labels.knopkiISostoyaniya}>
        <div className="component-row">
          <ButtonLink href="/calculator" icon={<Calculator size={19} />}>
            {labels.rasschitatDostavku}
          </ButtonLink>
          <ButtonLink href="/services/groupage" variant="secondary">
            {labels.podrobneeObUsluge}
          </ButtonLink>
          <ButtonLink
            href="/directions"
            variant="ghost"
            icon={<ArrowRight size={18} />}
          >
            {labels.napravleniya}
          </ButtonLink>
        </div>
        <div className="component-row">
          <ButtonLink size="small" href="/calculator">
            {labels.rasschitat}
          </ButtonLink>
          <ButtonLink size="small" variant="secondary" href="/documents">
            {labels.dokumenty}
          </ButtonLink>
          <span
            tabIndex={0}
            className="disabled-example"
            aria-describedby="disabled-reason"
          >
            <Button disabled>{labels.sohranitIzmeneniya}</Button>
            <span id="disabled-reason" className="control-tooltip">
              {labels.netIzmeneniyDlyaSohraneniya}
            </span>
          </span>
        </div>
        <div className="component-row">
          <Badge>{labels.demoProekt}</Badge>
          <CheckItem>{labels.stoimostSoglasovanaDoOtpravki}</CheckItem>
        </div>
      </Section>
      <Section
        id="forms"
        title={labels.polyaFormy}
        subtitle={labels.podpisiPoiskVDlinnyhSpiskahI}
      >
        <div className="form-grid">
          <Field label={labels.otkuda} htmlFor="origin">
            <Select
              id="origin"
              label={labels.otkuda}
              options={uiContent.cities.map((city) => ({
                value: city,
                label: city,
              }))}
              value={city}
              onChange={setCity}
            />
          </Field>
          <Field label={labels.formatGruza} htmlFor="cargo">
            <Select
              id="cargo"
              label={labels.formatGruza}
              options={[
                { value: "pallet", label: labels.pallety },
                { value: "boxes", label: labels.korobki },
                {
                  value: "special",
                  label: labels.negabaritnyyGruz,
                  disabled: true,
                  reason: labels.trebuetsyaSoglasovanieSMenedzherom,
                },
              ]}
              value={format}
              onChange={setFormat}
            />
          </Field>
          <Field label={labels.vesKg} htmlFor="weight">
            <Input
              id="weight"
              type="number"
              min="1"
              placeholder={labels.naprimer250}
            />
          </Field>
          <Field
            label={labels.telefon}
            htmlFor="phone"
            error={labels.ukazhiteTelefonPolnostyu11Tsifr}
          >
            <Input
              id="phone"
              type="tel"
              defaultValue="+7 900"
              aria-invalid="true"
              aria-describedby="phone-error"
            />
          </Field>
          <Field label={labels.kommentariyKPerevozke} htmlFor="comment">
            <Textarea
              id="comment"
              placeholder={labels.razmeryUpakovkaIOsobennostiGruza}
              rows={4}
            />
          </Field>
        </div>
      </Section>
      <Section
        id="cards"
        title={labels.kartochkiIPokazateli}
        subtitle={labels.primeryKomponentovChislaNizheVymyshleny}
      >
        <div className="demo-card-grid">
          {services.slice(0, 2).map((service) => (
            <Card key={service.href}>
              <h3>{service.title}</h3>
              <p className="muted">{service.description}</p>
              <ButtonLink href={service.href} variant="ghost">
                {labels.podrobnee}
                <ArrowRight size={17} />
              </ButtonLink>
            </Card>
          ))}
        </div>
        <div className="component-row stats-row">
          <Stat value="18" label={labels.gorodovVDemoSeti} />
          <Stat value="6" label={labels.skladovVDemoSeti} />
          <Stat value="1 250 ₽" label={labels.primerStoimosti} />
        </div>
      </Section>
      <Section id="disclosure" title={labels.vkladkiIRaskrytie}>
        <Tabs
          items={services.slice(0, 3).map((service) => ({
            label: service.title,
            content: <p className="measure">{service.description}</p>,
          }))}
        />
        <Accordion items={uiContent.faq} />
      </Section>
    </>
  );
}
