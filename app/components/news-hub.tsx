import { formatMonthYear } from "@/lib/format-date";
import { mockNews, NEWS_TYPE_LABELS, sortNewest, type NewsType } from "@/lib/mock-news";

const TYPE_STYLES: Record<NewsType, string> = {
  anniversary: "bg-amber-100 text-amber-800",
  birthday: "bg-pink-100 text-pink-800",
  blog: "bg-brand-green/15 text-brand-charcoal",
};

export default function NewsHub() {
  const news = sortNewest(mockNews, 6);

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {news.map((item) => (
        <li key={item.id} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_STYLES[item.type]}`}>
              {NEWS_TYPE_LABELS[item.type]}
            </span>
            <time dateTime={item.date} className="text-xs text-zinc-500">
              {formatMonthYear(item.date)}
            </time>
          </div>
          <h3 className="mt-2 font-medium text-zinc-900">{item.title}</h3>
          <p className="mt-1 text-sm text-brand-charcoal">{item.summary}</p>
        </li>
      ))}
    </ul>
  );
}
