"use client";

import { useState } from "react";
import Link from "next/link";
import api, { errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n/locale-context";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/Feedback";

type Mode = "translate" | "summarize" | "polite";

const MODE_IDS: Mode[] = ["translate", "summarize", "polite"];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ko", label: "Korean" },
  { code: "ne", label: "Nepali" },
  { code: "vi", label: "Vietnamese" },
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "th", label: "Thai" },
  { code: "uz", label: "Uzbek" },
];

const RECIPIENTS = ["employer", "landlord", "clinic", "bank", "professor", "neighbor"];

export default function AiAssistantPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLocale();

  const [mode, setMode] = useState<Mode>("translate");
  const [text, setText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("ko");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [outputLanguage, setOutputLanguage] = useState("en");
  const [recipientType, setRecipientType] = useState("employer");
  const [formality, setFormality] = useState("polite");

  const [result, setResult] = useState("");
  const [mock, setMock] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRun() {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const response =
        mode === "translate"
          ? await api.ai.translate({
              text,
              sourceLanguage: sourceLanguage || undefined,
              targetLanguage,
            })
          : mode === "summarize"
            ? await api.ai.summarize({ text, outputLanguage })
            : await api.ai.politeMessage({
                text,
                recipientType,
                formality,
              });

      setResult(response.result);
      setMock(response.mock);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("page.ai.title")}</h1>
        <p className="mt-1 text-sm text-slate-600">{t("page.ai.desc")}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {MODE_IDS.map((id) => {
          const label =
            id === "translate" ? t("ai.translate") : id === "summarize" ? t("ai.summarize") : t("ai.polite");
          const description =
            id === "translate"
              ? t("ai.translateDesc")
              : id === "summarize"
                ? t("ai.summarizeDesc")
                : t("ai.politeDesc");
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setMode(id);
                setResult("");
                setError("");
              }}
              className={`card p-4 text-left transition-colors ${
                mode === id ? "border-brand-500 ring-1 ring-brand-500" : "hover:bg-slate-50"
              }`}
            >
              <p className="font-medium text-slate-900">{label}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{description}</p>
            </button>
          );
        })}
      </div>

      <div className="card space-y-4 p-6">
        {!isAuthenticated && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {t("ui.signInRequired")}{" "}
            <Link href="/login" className="font-medium text-brand-600 hover:underline">
              {t("nav.signIn")}
            </Link>
          </div>
        )}

        {mode === "translate" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label={t("ai.sourceLang")}
              value={sourceLanguage}
              onChange={(event) => setSourceLanguage(event.target.value)}
            >
              <option value="">{t("ui.all")}</option>
              {LANGUAGES.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </Select>
            <Select
              label={t("ai.targetLang")}
              value={targetLanguage}
              onChange={(event) => setTargetLanguage(event.target.value)}
            >
              {LANGUAGES.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </Select>
          </div>
        )}

        {mode === "summarize" && (
          <Select
            label="Summary language"
            value={outputLanguage}
            onChange={(event) => setOutputLanguage(event.target.value)}
          >
            {LANGUAGES.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </Select>
        )}

        {mode === "polite" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Recipient"
              value={recipientType}
              onChange={(event) => setRecipientType(event.target.value)}
            >
              {RECIPIENTS.map((recipient) => (
                <option key={recipient} value={recipient}>
                  {recipient.charAt(0).toUpperCase() + recipient.slice(1)}
                </option>
              ))}
            </Select>
            <Select
              label="Formality"
              value={formality}
              onChange={(event) => setFormality(event.target.value)}
            >
              <option value="casual">Casual</option>
              <option value="polite">Polite</option>
              <option value="formal">Formal</option>
            </Select>
          </div>
        )}

        <Textarea
          label={t("ai.input")}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t("ai.input")}
          className="min-h-[160px]"
        />

        {error && <ErrorState message={error} />}

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {isAuthenticated ? t("nav.signIn") : t("ui.signInRequired")}
          </p>
          <Button onClick={handleRun} loading={loading} disabled={!text.trim() || !isAuthenticated}>
            {mode === "translate"
              ? t("ai.translate")
              : mode === "summarize"
                ? t("ai.summarize")
                : t("ai.polite")}
          </Button>
        </div>
      </div>

      {result && (
        <div className="card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-slate-900">{t("ai.result")}</h2>
            {mock && <Badge tone="amber">Mock mode — no API key configured</Badge>}
          </div>

          <div className="mt-4 whitespace-pre-wrap leading-relaxed text-slate-700">{result}</div>

          <div className="mt-5 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(result)}
            >
              Copy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
