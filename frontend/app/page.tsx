import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* About Section */}
        <section className="mb-20">
          <h1 className="text-2xl font-medium mb-8">evan liu</h1>
          <div className="space-y-4 text-muted-foreground">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/5"></div>
          </div>
        </section>

        {/* Projects Section */}
        <section>
          <h2 className="text-2xl font-medium mb-8">projects</h2>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
          </div>
        </section>
      </main>
    </div>
  );
}
