"use client"

import { useState, type FormEvent } from "react"
import { Check, Loader2, ArrowRight } from "lucide-react"
import { t } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

type Status = "idle" | "loading" | "success" | "error"

export function NewsletterSubscribe({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || status === "loading") return

    setStatus("loading")

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) throw new Error()
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2.5">
          <span className="flex items-center justify-center size-5 rounded-full bg-primary/10">
            <Check className="size-3 text-primary" />
          </span>
          <p className="text-sm text-foreground/70">
            {t(locale, "newsletter.success")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h3 className="font-serif text-base font-semibold text-foreground tracking-tight">
        {t(locale, "newsletter.title")}
      </h3>
      <p className="text-[13px] text-muted-foreground mt-1 mb-4">
        {t(locale, "newsletter.description")}
      </p>
      <form onSubmit={handleSubmit} className="flex justify-center">
        <div className="relative flex items-center w-full max-w-sm rounded-full border border-border bg-background shadow-xs transition-shadow focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
          <input
            type="email"
            placeholder={t(locale, "newsletter.placeholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === "error") setStatus("idle")
            }}
            required
            autoComplete="email"
            className="flex-1 h-10 bg-transparent pl-4 pr-2 text-sm text-foreground placeholder:text-muted-foreground outline-none rounded-l-full"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 h-8 mr-1 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none inline-flex items-center gap-1.5"
          >
            {status === "loading" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <>
                {t(locale, "newsletter.subscribe")}
                <ArrowRight className="size-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
      {status === "error" && (
        <p className="text-xs text-destructive mt-2">
          {t(locale, "newsletter.error")}
        </p>
      )}
    </div>
  )
}
