import { faqList } from "@/config/data";
import Link from "next/link";

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">FAQ</p>
          <h1 className="text-3xl font-semibold text-slate-900 mt-2">Частые вопросы</h1>
          <p className="text-slate-600 mt-3">
            Вопросы и ответы основаны на типовых обращениях клиентов.
          </p>
        </div>
        <Link
          href="/contacts"
          className="hidden rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 md:inline-flex"
        >
          Задать вопрос
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {faqList.map((item) => (
          <div
            key={item.q}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="text-sm font-semibold text-slate-900">{item.q}</div>
            <div className="mt-2 text-sm text-slate-600">{item.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

