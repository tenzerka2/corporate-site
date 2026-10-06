import { company } from "@/content/site";
import { Icon } from "../Icon";
import { OrderButton } from "../OrderButton";
import styles from "./ContactCard.module.css";

/** Closing card on inner pages: talk to a manager by phone or leave a request. */
export function ContactCard({
  text = "Расскажите о грузе и маршруте. Менеджер подберёт решение и пришлёт расчёт в течение часа.",
  summary,
}: {
  text?: string;
  summary?: string;
}) {
  return (
    <section className="section" aria-labelledby="contact-card-title">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.side}>
            <Icon name="user" size={40} />
            <h2 id="contact-card-title">Поговорить с менеджером</h2>
          </div>
          <div className={styles.main}>
            <p>{text}</p>
            <div className={styles.actions}>
              <a className="button" href={company.phoneHref}>
                <Icon name="phone" />
                {company.phone}
              </a>
              <OrderButton label="Оставить заявку" summary={summary} className="button button-secondary" />
            </div>
            <p className={styles.hours}>{company.hours}, ответ в течение 15 минут</p>
          </div>
        </div>
      </div>
    </section>
  );
}
