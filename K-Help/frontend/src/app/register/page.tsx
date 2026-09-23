"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { errorMessage } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/Feedback";

const VISA_TYPES = [
  "D-2 (Student)",
  "D-4 (Language Trainee)",
  "D-10 (Job Seeker)",
  "E-9 (Non-professional Worker)",
  "E-7 (Professional Worker)",
  "F-2 (Resident)",
  "F-4 (Overseas Korean)",
  "F-5 (Permanent Resident)",
  "Other",
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    nationality: "",
    visaType: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim() || undefined,
        nationality: form.nationality.trim() || undefined,
        visaType: form.visaType || undefined,
      });
      router.push("/community");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg py-8">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Tell us a little about yourself so we can tailor guides, jobs and housing to your
          situation.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <ErrorState message={error} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Username"
              name="username"
              required
              minLength={3}
              value={form.username}
              onChange={(event) => update("username", event.target.value)}
              placeholder="yourname"
            />
            <Input
              label="Full name"
              name="fullName"
              value={form.fullName}
              onChange={(event) => update("fullName", event.target.value)}
              placeholder="Ashish Pokhrel"
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="you@example.com"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nationality"
              name="nationality"
              value={form.nationality}
              onChange={(event) => update("nationality", event.target.value)}
              placeholder="Nepal"
            />
            <Select
              label="Visa type"
              name="visaType"
              value={form.visaType}
              onChange={(event) => update("visaType", event.target.value)}
            >
              <option value="">Prefer not to say</option>
              {VISA_TYPES.map((visa) => (
                <option key={visa} value={visa}>
                  {visa}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Password"
              name="password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(event) => update("password", event.target.value)}
              hint="At least 8 characters"
            />
            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={(event) => update("confirmPassword", event.target.value)}
            />
          </div>

          <Button type="submit" loading={submitting} className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
