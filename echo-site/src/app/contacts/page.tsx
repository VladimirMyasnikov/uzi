import { siteConfig } from "@/config/site";

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Контакты</p>
        <h1 className="text-3xl font-semibold text-slate-900">Свяжитесь с нами</h1>
        <p className="text-slate-600">
          Офис, склад и сервисный центр в Москве. Пример контента — временный, позже заменим на актуальные данные.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Адрес</div>
            <div className="mt-2 text-sm text-slate-600">{siteConfig.contacts.address}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">Телефоны</div>
              <div className="mt-1 text-sm text-slate-600">{siteConfig.contacts.phoneMain}</div>
              <div className="text-sm text-slate-600">{siteConfig.contacts.phoneTollFree}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Email</div>
              <div className="mt-1 text-sm text-slate-600">{siteConfig.contacts.email}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Реквизиты</div>
              <div className="mt-1 text-sm text-slate-600">{siteConfig.contacts.requisites}</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-8 text-white shadow-sm">
          <h2 className="text-xl font-semibold">Оставить запрос</h2>
          <p className="mt-2 text-sm text-slate-200">
            Оставьте контакты — перезвоним и уточним задачу по поставке или ремонту.
          </p>
          <form className="mt-5 space-y-3">
            <input
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-200 focus:border-white/40"
              placeholder="Имя"
            />
            <input
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-200 focus:border-white/40"
              placeholder="Телефон"
              type="tel"
              inputMode="tel"
              pattern="[0-9+()\\s-]{7,}"
              maxLength={20}
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
    </div>
  );
}

