import { siteConfig } from "@/config/site";

const services = [
  {
    title: "Ремонт и обслуживание УЗИ-сканеров",
    desc: "Диагностика, ремонт, калибровка, запчасти и гарантия сервиса.",
  },
  {
    title: "Ремонт и восстановление датчиков",
    desc: "Шлейфы, пьезоэлементы, разъемы, герметизация и тестирование.",
  },
];

const catalog = [
  {
    title: "Медицинские УЗИ сканеры",
    note: "Стационарные и портативные решения",
  },
  {
    title: "Ветеринарные УЗИ сканеры",
    note: "Портативные для агропрома и ветклиник",
  },
  {
    title: "Датчики УЗИ",
    note: "Совместимость с популярными брендами",
  },
  {
    title: "Биопсийные насадки",
    note: "Аксессуары и расходные материалы",
  },
  {
    title: "Специальные предложения",
    note: "Со склада и по акционным ценам",
  },
];

const specials = [
  { title: "Портативный GE Vivid i", badge: "Спецпредложение" },
  { title: "УЗИ Toshiba Aplio MX со склада", badge: "Со склада" },
];

const news = [
  {
    title: "Кто изобрел ультразвуковые исследования? История ультразвука.",
    date: "27 августа 2024",
  },
  {
    title: "Будущее сонографии: Искусственный интеллект",
    date: "20 августа 2024",
  },
];

const faq = [
  {
    q: "Чем отличается ветеринарный и медицинский сканер?",
    a: "Различаются предустановками, частотами датчиков и софтом под задачи.",
  },
  {
    q: "Могут ли датчики работать с разными брендами?",
    a: "Есть совместимые модели и переходники — проверяем по серийному номеру.",
  },
  {
    q: "Что такое трансдьюсер и как он работает?",
    a: "Это датчик, преобразующий электрические импульсы в ультразвук и обратно.",
  },
];

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="font-semibold text-lg">{siteConfig.name}</div>
          <div className="hidden gap-6 text-sm font-medium md:flex">
            <a href="#services" className="hover:text-slate-600">
              Услуги
            </a>
            <a href="#catalog" className="hover:text-slate-600">
              Оборудование
            </a>
            <a href="#specials" className="hover:text-slate-600">
              Акции
            </a>
            <a href="#news" className="hover:text-slate-600">
              Новости
            </a>
            <a href="#contacts" className="hover:text-slate-600">
              Контакты
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span className="text-slate-500">{siteConfig.contacts.phoneMain}</span>
            <a
              href={`tel:${siteConfig.contacts.phoneTollFreeHref}`}
              className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
            >
              {siteConfig.contacts.phoneTollFree}
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        <section className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              УЗИ сканеры, датчики, сервис
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900">
              Комплексные поставки и ремонт УЗИ оборудования
            </h1>
            <p className="text-lg text-slate-600">
              Поставляем медицинские и ветеринарные УЗИ сканеры, совместимые
              датчики и биопсийные насадки. Выполняем ремонт и обслуживание
              сканеров и датчиков по всей России.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contacts"
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Оставить заявку
              </a>
              <a
                href="tel:88005002647"
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:border-slate-400"
              >
                Позвонить
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">
              Быстрая заявка
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Оставьте контакты — перезвоним и уточним задачу по поставке или
              ремонту.
            </p>
            <form className="mt-6 space-y-4">
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="Имя"
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="Телефон"
              />
              <textarea
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                rows={3}
                placeholder="Комментарий"
              />
              <button
                type="button"
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Отправить
              </button>
              <p className="text-xs text-slate-500">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
              </p>
            </form>
          </div>
        </section>

        <section id="services" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Услуги</h2>
            <a href="#contacts" className="text-sm text-slate-600 hover:text-slate-800">
              Связаться
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="catalog" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Каталог</h2>
            <a href="#contacts" className="text-sm text-slate-600 hover:text-slate-800">
              Запросить прайс
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="text-lg font-semibold text-slate-900">
                  {item.title}
                </div>
                <div className="mt-2 text-sm text-slate-600">{item.note}</div>
                <button className="mt-4 text-sm font-semibold text-slate-900 hover:text-slate-700">
                  Подробнее →
                </button>
              </div>
            ))}
          </div>
        </section>

        <section id="specials" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">
              Специальные предложения
            </h2>
            <a href="#contacts" className="text-sm text-slate-600 hover:text-slate-800">
              Получить КП
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {specials.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  {item.badge}
                </span>
                <div className="mt-3 text-lg font-semibold text-slate-900">
                  {item.title}
                </div>
                <button className="mt-4 text-sm font-semibold text-slate-900 hover:text-slate-700">
                  Подробнее →
                </button>
              </div>
            ))}
          </div>
        </section>

        <section id="news" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Новости</h2>
            <a href="#contacts" className="text-sm text-slate-600 hover:text-slate-800">
              Все новости
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {news.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  {item.date}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <button className="mt-4 text-sm font-semibold text-slate-900 hover:text-slate-700">
                  Читать →
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">FAQ</h2>
            <a href="#contacts" className="text-sm text-slate-600 hover:text-slate-800">
              Задать вопрос
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faq.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="text-sm font-semibold text-slate-900">
                  {item.q}
                </div>
                <div className="mt-2 text-sm text-slate-600">{item.a}</div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="contacts"
          className="rounded-3xl border border-slate-200 bg-slate-900 px-8 py-10 text-white shadow-sm"
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Контакты</h2>
              <p className="text-slate-200">
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
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-200 focus:border-white/40"
                  placeholder="Имя"
                />
                <input
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-200 focus:border-white/40"
                  placeholder="Телефон"
                />
                <textarea
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-200 focus:border-white/40"
                  rows={3}
                  placeholder="Опишите задачу или оборудование"
                />
                <button
                  type="button"
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                >
                  Отправить запрос
                </button>
                <p className="text-xs text-slate-200">
                  Мы свяжемся в рабочее время, обычно в течение 30 минут.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/70 py-6 text-sm text-slate-600">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>© 2025 Ray Systems. Все права защищены.</div>
          <div className="flex gap-4">
            <a href="#services" className="hover:text-slate-800">
              Услуги
            </a>
            <a href="#catalog" className="hover:text-slate-800">
              Каталог
            </a>
            <a href="#contacts" className="hover:text-slate-800">
              Контакты
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
