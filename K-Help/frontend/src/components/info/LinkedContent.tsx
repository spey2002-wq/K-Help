import { Fragment } from "react";
import { FINANCE_LINKS } from "@/lib/banks";

/** Every spelling of every bank or money service, mapped to its official site. */
const URL_BY_NAME = new Map<string, string>();
for (const link of FINANCE_LINKS) {
  URL_BY_NAME.set(link.name, link.url);
  for (const alias of link.aliases ?? []) URL_BY_NAME.set(alias, link.url);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Longest names first so "Toss Bank" wins over "Toss", "KB Kookmin Bank" over "KB".
const NAME_PATTERN = new RegExp(
  `\\b(${[...URL_BY_NAME.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|")})\\b`,
);

/**
 * Guide text where bank and money-service names become links to the
 * organisation's own website.
 */
export function LinkedContent({ text }: { text: string }) {
  // split() with one capture group puts the matched names at the odd indexes.
  const parts = text.split(new RegExp(NAME_PATTERN.source, "g"));

  return (
    <>
      {parts.map((part, index) => {
        const url = index % 2 === 1 ? URL_BY_NAME.get(part) : undefined;
        return url ? (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700"
            title={`Open ${part} official website`}
          >
            {part}
          </a>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        );
      })}
    </>
  );
}
