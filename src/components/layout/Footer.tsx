function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-6 mt-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} AN Valideyn Akademiyası. Bütün hüquqlar qorunur.</p>
        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com/s_akhunoff"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon />
            <span>Instagram</span>
          </a>
          <span className="text-muted-foreground">By s_akhundoff</span>
        </div>
      </div>
    </footer>
  );
}
