import { FINANCE_GROUPS } from "@/lib/banks";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Clickable list of banks and money services; each name opens the official website. */
export function BankDirectory({ compact = false }: { compact?: boolean }) {
  return (
    <section aria-labelledby="bank-directory" className="space-y-5">
      <div>
        <h2 id="bank-directory" className="text-lg font-semibold text-slate-900">
          Bank and money service websites
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Tap a name to open its official website in a new tab. K-Help does not recommend one bank
          over another, so compare fees and foreigner support before you open an account.
        </p>
      </div>

      {FINANCE_GROUPS.map((group) => (
        <div key={group.id} className="card p-5">
          <h3 className="font-semibold text-slate-900">{group.title}</h3>
          <p className="mt-0.5 text-sm text-slate-600">{group.description}</p>

          <ul className={`mt-4 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
            {group.items.map((item) => (
              <li key={item.name}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full rounded-xl border border-slate-200 p-3 transition-colors hover:border-brand-300 hover:bg-brand-50/50"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-900 group-hover:text-brand-700">
                      {item.name}
                    </span>
                    <span aria-hidden="true" className="text-slate-400 group-hover:text-brand-600">
                      ↗
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">{hostOf(item.url)}</span>
                  <span className="mt-1.5 block text-sm text-slate-600">{item.note}</span>
                  <span className="sr-only"> (opens the official website in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
