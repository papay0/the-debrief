import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 sm:py-32">
      <div className="flex flex-col items-center text-center max-w-lg">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.15em] mb-3">
          404
        </span>

        <h1 className="text-2xl sm:text-3xl font-semibold font-serif text-foreground mb-3">
          Page not found
        </h1>

        <p className="text-muted-foreground leading-relaxed mb-8 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to the latest AI news.
        </p>

        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
