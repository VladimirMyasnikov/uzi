import Link from "next/link";
import { newsList as news } from "@/config/data";
import { getCatalogCategories } from "@/lib/catalog-loader";
import {
  getSiteConfig,
  getServicesList,
  getSpecialsList,
  getFaqList,
} from "@/lib/content-loader";

const stats = [
  { label: "Лет в сервисе", value: "15+" },
  { label: "Клиентов", value: "2400" },
  { label: "Городов", value: "200+" },
  { label: "Склад", value: "Москва" },
];

export default async function Home() {
  const [catalog, siteConfig, services, specials, faq] = await Promise.all([
    getCatalogCategories(),
    getSiteConfig(),
    getServicesList(),
    getSpecialsList(),
    getFaqList(),
  ]);
  const faqPreview = faq.slice(0, 3);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
      <section className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            УЗИ · поставки · сервис
          </span>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold leading-tight text-[color:var(--fg)] sm:text-5xl">
              Комплексные поставки, ремонт и сервис УЗИ оборудования
            </h1>
            <p className="text-lg text-[color:var(--muted)]">
              Подбираем медицинские и ветеринарные УЗИ сканеры, совместимые датчики, биопсийные насадки и запчасти.
              Собственный сервисный центр: диагностика, ремонт, гарантия.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#quote"
              className="rounded-full bg-[color:var(--fg)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Запросить КП
            </a>
            <a
              href={`tel:${siteConfig.contacts.phoneTollFreeHref}`}
              className="rounded-full border px-5 py-3 text-sm font-semibold text-[color:var(--fg)] transition hover:-translate-y-0.5"
              style={{ borderColor: "var(--border)" }}
            >
              Позвонить
            </a>
            <Link
              href="/catalog"
              className="rounded-full border px-5 py-3 text-sm font-semibold text-[color:var(--fg)] transition hover:-translate-y-0.5"
              style={{ borderColor: "var(--border)" }}
            >
              Каталог
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border bg-[color:var(--card)] p-4 shadow-sm"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="text-base font-semibold text-[color:var(--fg)]">{stat.value}</div>
                <div className="text-xs text-[color:var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div
              className="rounded-2xl border bg-[color:var(--card)]/90 p-4 text-sm"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="text-[color:var(--fg)] font-semibold">Сервисный центр</div>
              <p className="mt-1 text-[color:var(--muted)]">
                Герметизация, замена кабелей и пьезоэлементов, финальное тестирование под нагрузкой.
              </p>
            </div>
            <div
              className="rounded-2xl border bg-[color:var(--card)]/90 p-4 text-sm"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="text-[color:var(--fg)] font-semibold">Работаем по России</div>
              <p className="mt-1 text-[color:var(--muted)]">
                Доставка из Москвы, согласуем выезд инженера или удобную схему логистики.
              </p>
            </div>
          </div>
        </div>

        <div className="card-panel rounded-3xl p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-[color:var(--fg)]">Запрос КП</h3>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                Ответим в рабочее время, уточним совместимость и предложим варианты в наличии.
              </p>
            </div>
            <span className="rounded-full bg-[color:var(--accent)]/15 px-3 py-1 text-xs font-semibold text-[color:var(--accent)]">
              Ответ за 30 мин
            </span>
          </div>
          <form className="mt-6 space-y-3">
            <input
              className="w-full rounded-xl border bg-[color:var(--bg)] px-4 py-3 text-sm text-[color:var(--fg)] outline-none placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]"
              style={{ borderColor: "var(--border)" }}
              placeholder="Имя"
            />
            <input
              className="w-full rounded-xl border bg-[color:var(--bg)] px-4 py-3 text-sm text-[color:var(--fg)] outline-none placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]"
              style={{ borderColor: "var(--border)" }}
              placeholder="Телефон"
              type="tel"
              inputMode="tel"
              pattern="[0-9+()\\s-]{7,}"
              maxLength={20}
            />
            <textarea
              className="w-full rounded-xl border bg-[color:var(--bg)] px-4 py-3 text-sm text-[color:var(--fg)] outline-none placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]"
              style={{ borderColor: "var(--border)" }}
              rows={3}
              placeholder="Комментарий или модель оборудования"
            />
            <button
              type="button"
              className="w-full rounded-xl bg-[color:var(--fg)] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Запросить КП
            </button>
            <p className="text-xs text-[color:var(--muted)]">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
            </p>
          </form>
          <div className="mt-4 grid gap-2 text-xs text-[color:var(--muted)] sm:grid-cols-2">
            <div>✓ Проверим совместимость с вашим аппаратом.</div>
            <div>✓ Предложим аналог, если нужной позиции нет.</div>
          </div>
        </div>
      </section>

      <section id="catalog" className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted)]">Каталог</p>
            <h2 className="text-2xl font-semibold text-[color:var(--fg)]">Категории и наличие</h2>
            <p className="text-sm text-[color:var(--muted)]">
              На базе локального каталога: сканеры, датчики, насадки и запчасти.
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold text-[color:var(--fg)] transition hover:-translate-y-0.5"
            style={{ borderColor: "var(--border)" }}
          >
            Открыть каталог
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((item) => (
            <Link
              key={item.title}
              href={item.slug ? `/catalog/${encodeURIComponent(item.slug)}` : "/catalog"}
              className="card-panel block rounded-2xl p-5 transition hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-lg font-semibold text-[color:var(--fg)]">{item.title}</div>
                <span className="rounded-full bg-[color:var(--accent)]/15 px-3 py-1 text-xs font-semibold text-[color:var(--accent)]">
                  {item.productsCount} позиций
                </span>
              </div>
              <div className="mt-2 text-sm text-[color:var(--muted)]">
                Подбор совместимых решений и варианты в наличии.
              </div>
              <div className="mt-4 text-sm font-semibold text-[color:var(--fg)]">Смотреть →</div>
            </Link>
          ))}
        </div>
      </section>

      <section id="services" className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted)]">Услуги</p>
            <h2 className="text-2xl font-semibold text-[color:var(--fg)]">Сервис и ремонт</h2>
            <p className="text-sm text-[color:var(--muted)]">Диагностика, восстановление и гарантия.</p>
          </div>
          <Link
            href="/services/repair-scanners"
            className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold text-[color:var(--fg)] transition hover:-translate-y-0.5"
            style={{ borderColor: "var(--border)" }}
          >
            Все услуги
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((item) => (
            <Link
              key={item.title}
              href={item.slug ? `/services/${item.slug}` : "/services/repair-scanners"}
              className="card-panel block rounded-2xl p-6 transition hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-[color:var(--fg)]">{item.title}</h3>
                <span className="text-xs font-semibold text-[color:var(--muted)]">SLA/гарантия</span>
              </div>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{item.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
                {item.steps.map((step) => (
                  <span
                    key={step}
                    className="rounded-full bg-[color:var(--accent)]/12 px-3 py-1 font-semibold text-[color:var(--accent)]"
                  >
                    {step}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="specials" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted)]">Акции</p>
            <h2 className="text-2xl font-semibold text-[color:var(--fg)]">Специальные предложения</h2>
          </div>
          <Link
            href="/specials"
            className="hidden rounded-full border px-4 py-2 text-sm font-semibold text-[color:var(--fg)] transition hover:-translate-y-0.5 sm:inline-flex"
            style={{ borderColor: "var(--border)" }}
          >
            Все акции
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {specials.map((item) => (
            <Link
              key={item.title}
              href="/specials"
              className="card-panel block rounded-2xl p-5 transition hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <span className="inline-flex items-center rounded-full bg-[color:var(--accent)]/15 px-3 py-1 text-xs font-semibold text-[color:var(--accent)]">
                    {item.badge}
                  </span>
                  <div className="text-lg font-semibold text-[color:var(--fg)]">{item.title}</div>
                  <div className="text-sm text-[color:var(--muted)]">Выгодные условия, уточним по запросу.</div>
                </div>
                <div className="text-sm font-semibold text-[color:var(--fg)] hover:text-[color:var(--muted)]">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="quote" className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--fg)]">Запрос КП</h2>
            <p className="text-sm text-[color:var(--muted)]">
              Короткая форма: телефон, задача, модель аппарата или датчика.
            </p>
          </div>
          <a
            href="tel:88005002647"
            className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold text-[color:var(--fg)] transition hover:-translate-y-0.5"
            style={{ borderColor: "var(--border)" }}
          >
            +7 953 112 54 16
          </a>
        </div>
        <div className="card-panel rounded-3xl p-8">
          <form className="space-y-3">
            <input
              className="w-full rounded-xl border bg-[color:var(--bg)] px-4 py-3 text-sm text-[color:var(--fg)] outline-none placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]"
              style={{ borderColor: "var(--border)" }}
              placeholder="Имя"
            />
            <input
              className="w-full rounded-xl border bg-[color:var(--bg)] px-4 py-3 text-sm text-[color:var(--fg)] outline-none placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]"
              style={{ borderColor: "var(--border)" }}
              placeholder="Телефон"
              type="tel"
              inputMode="tel"
              pattern="[0-9+()\\s-]{7,}"
              maxLength={20}
            />
            <textarea
              className="w-full rounded-xl border bg-[color:var(--bg)] px-4 py-3 text-sm text-[color:var(--fg)] outline-none placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]"
              style={{ borderColor: "var(--border)" }}
              rows={3}
              placeholder="Комментарий или модель оборудования"
            />
            <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
              <button
                type="button"
                className="w-full rounded-xl bg-[color:var(--fg)] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Запросить КП
              </button>
              <button
                type="button"
                className="w-full rounded-xl border px-4 py-3 text-sm font-semibold text-[color:var(--fg)] transition hover:-translate-y-0.5"
                style={{ borderColor: "var(--border)" }}
              >
                Позвонить сейчас
              </button>
            </div>
            <p className="text-xs text-[color:var(--muted)]">
              Сообщения об успехе/ошибке добавим при подключении серверной логики.
            </p>
          </form>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[color:var(--fg)]">Новости</h2>
            <Link
              href="/news"
              className="text-sm font-semibold text-[color:var(--muted)] hover:text-[color:var(--fg)]"
            >
              Все новости →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {news.map((item) => (
              <Link
                key={item.title}
                href="/news"
                className="card-panel block rounded-2xl p-5 transition hover:-translate-y-1"
              >
                <div className="text-xs uppercase tracking-wide text-[color:var(--muted)]">
                  {item.date}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-[color:var(--fg)]">{item.title}</h3>
                <div className="mt-3 text-sm text-[color:var(--muted)]">Коротко о материалах и предложениях.</div>
                <div className="mt-4 text-sm font-semibold text-[color:var(--fg)]">Читать →</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[color:var(--fg)]">FAQ</h2>
            <Link
              href="/faq"
              className="text-sm font-semibold text-[color:var(--muted)] hover:text-[color:var(--fg)]"
            >
              Все вопросы →
            </Link>
          </div>
          <div className="grid gap-3">
            {faqPreview.map((item) => (
              <details
                key={item.q}
                className="card-panel rounded-2xl p-4 transition hover:-translate-y-0.5"
              >
                <summary className="cursor-pointer text-sm font-semibold text-[color:var(--fg)]">
                  {item.q}
                </summary>
                <div className="mt-2 text-sm text-[color:var(--muted)]">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contacts"
        className="rounded-3xl border px-8 py-10 text-white"
        style={{ backgroundColor: "var(--fg)", borderColor: "var(--border)" }}
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Контакты</h2>
            <p className="text-white/80">
              {siteConfig.contacts.address}. Офис, склад и сервисный центр.
            </p>
            <div className="space-y-2 text-sm">
              <div className="font-semibold">Телефоны</div>
              <div>{siteConfig.contacts.phoneMain}</div>
              <div>{siteConfig.contacts.phoneTollFree}</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="font-semibold">Email</div>
              <div>{siteConfig.contacts.email}</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="font-semibold">Реквизиты</div>
              <div>{siteConfig.contacts.requisites}</div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Запрос на поставку или ремонт</h3>
            <form className="space-y-3">
              <input
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/60 focus:border-white/30"
                placeholder="Имя"
              />
              <input
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/60 focus:border-white/30"
                placeholder="Телефон"
                type="tel"
                inputMode="tel"
                pattern="[0-9+()\\s-]{7,}"
                maxLength={20}
              />
              <textarea
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/60 focus:border-white/30"
                rows={3}
                placeholder="Опишите задачу или оборудование"
              />
              <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                <button
                  type="button"
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[color:var(--fg)] transition hover:-translate-y-0.5"
                >
                  Запросить КП
                </button>
                <a
                  href={`tel:${siteConfig.contacts.phoneTollFreeHref}`}
                  className="flex w-full items-center justify-center rounded-xl border border-white/30 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Позвонить
                </a>
              </div>
              <p className="text-xs text-white/80">
                Связываемся в рабочее время, обычно в течение 30 минут.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
