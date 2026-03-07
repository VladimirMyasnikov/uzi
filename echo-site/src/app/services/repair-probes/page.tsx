import Link from "next/link";
import { getServicesList } from "@/lib/content-loader";

export default async function RepairProbesPage() {
  const servicesList = await getServicesList();
  const service = servicesList.find((s) => s.slug === "repair-probes");

  if (!service) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Услуги</p>
        <h1 className="text-3xl font-semibold text-slate-900">{service.title}</h1>
        <p className="text-slate-600">{service.desc}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {service.steps.map((step) => (
          <div
            key={step}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="text-sm font-semibold text-slate-900">{step}</div>
            <div className="mt-2 text-sm text-slate-600">
              Фиксируем входящее состояние, согласуем ремонт и сроки.
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-8 text-white shadow-sm">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Нужен ремонт датчика?</h2>
            <p className="mt-2 text-sm text-slate-200">
              Оставьте контакты и краткое описание неисправности — вернем в строй после диагностики.
            </p>
          </div>
          <Link
            href="/contacts"
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 md:w-auto"
          >
            Оставить заявку
          </Link>
        </div>
      </div>
    </div>
  );
}

