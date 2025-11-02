import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b border-border">
      <nav className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="text-sm font-medium hover:text-muted-foreground transition-colors"
          >
            index
          </Link>
          <Link 
            href="/blog" 
            className="text-sm font-medium hover:text-muted-foreground transition-colors"
          >
            blog
          </Link>
        </div>
      </nav>
    </header>
  );
}

