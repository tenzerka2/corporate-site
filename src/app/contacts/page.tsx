import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { OrderButton } from "@/components/OrderButton";
import { Hero } from "@/components/ui/Hero";
import { contactsPage as copy, warehouseList } from "@/content/pages";
import { company } from "@/content/site";
import styles from "./page.module.css";

export const metadata: Metadata = { title: copy.title, description: copy.lead };

const tel = (phone: string) => `tel:${phone.replace(/\D/g, "")}`;

export default function ContactsPage() {
  return (
    <>
      <Hero
        crumbs={[{ label: copy.title }]}
        title={copy.h1}
        lead={copy.lead}
        actions={[{ label: company.phone, href: company.phoneHref, icon: "phone" }]}
        extraAction={
          <OrderButton label={copy.formAction} className="button button-secondary">
            <Icon name="mail" />
          </OrderButton>
        }
      />

      <section className="section" aria-labelledby="departments-title">
        <div className="container">
          <h2 id="departments-title" className="sr-only">
            Отделы
          </h2>
          <ul className={`plain-list ${styles.departments}`}>
            {copy.departments.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p className="muted">{item.text}</p>
                <Link className={styles.phone} href={tel(item.phone)}>
                  {item.phone}
                </Link>
                <Link className="link" href={`mailto:${item.email}`}>
                  {item.email}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block" aria-labelledby="office-title">
        <div className={`container ${styles.office}`}>
          <Image src={copy.officeImage} alt={copy.officeAlt} sizes="(min-width: 1024px) 560px, 100vw" placeholder="blur" />
          <div>
            <h2 id="office-title">{copy.officeTitle}</h2>
            <p className={styles.officeText}>{copy.office}</p>
            <p>
              <Link className="link" href="/about#requisites">
                Реквизиты компании
                <Icon name="arrow" size={16} />
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="wh-title">
        <div className="container">
          <div className="head-left">
            <h2 id="wh-title">{copy.warehousesTitle}</h2>
            <p>Приёмка и выдача грузов ежедневно с 08:00 до 20:00.</p>
          </div>
          <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Адреса складов">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Город</th>
                  <th scope="col">Адрес</th>
                  <th scope="col">Телефон склада</th>
                </tr>
              </thead>
              <tbody>
                {warehouseList.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">
                      <Link href={`/warehouses#${item.id}`}>{item.city}</Link>
                    </th>
                    <td>{item.address}</td>
                    <td>
                      <Link href={tel(item.phone)}>{item.phone}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
