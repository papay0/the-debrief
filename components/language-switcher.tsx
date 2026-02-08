"use client"

import { usePathname, useRouter } from "next/navigation"
import { Globe, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { locales } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

const languageNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
}

function getTargetPath(pathname: string, currentLocale: Locale, targetLocale: Locale): string {
  // Strip current locale prefix if present
  let basePath = pathname
  if (currentLocale !== "en") {
    basePath = pathname.replace(new RegExp(`^/${currentLocale}`), "") || "/"
  }

  // Add target locale prefix if not English
  if (targetLocale === "en") return basePath
  return `/${targetLocale}${basePath}`
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Switch language"
        >
          <Globe className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => {
              if (l !== locale) {
                router.push(getTargetPath(pathname, locale, l))
              }
            }}
            className="flex items-center justify-between gap-3 cursor-pointer"
          >
            <span className={l === locale ? "text-foreground font-medium" : "text-muted-foreground"}>
              {languageNames[l]}
            </span>
            {l === locale && (
              <Check className="h-3.5 w-3.5 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
