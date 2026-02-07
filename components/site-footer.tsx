export function SiteFooter() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} The Debrief</p>
      </div>
    </footer>
  )
}
