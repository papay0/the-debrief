import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center px-4 py-24 sm:py-32 overflow-hidden">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/[0.07] blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 h-[300px] w-[400px] rounded-full bg-primary/[0.05] blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Large 404 with gradient text */}
        <div className="relative mb-2">
          <h1 className="text-[10rem] sm:text-[14rem] font-bold leading-none tracking-tighter text-primary/[0.08] select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl sm:text-7xl font-bold tracking-tighter text-foreground">
              404
            </span>
          </div>
        </div>

        {/* Divider line */}
        <div className="w-16 h-px bg-primary/40 mb-6" />

        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-3">
          Page not found
        </h2>

        <p className="text-muted-foreground leading-relaxed mb-8 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to the latest AI news.
        </p>

        <Link href="/">
          <Button variant="outline" size="lg" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
