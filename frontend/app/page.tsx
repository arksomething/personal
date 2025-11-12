import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* About Section */}
        <section className="mb-20">
          <h1 className="text-2xl font-medium mb-8">Evan Liu</h1>
          <div className="space-y-4 text-muted-foreground">
            <p>Hi, I’m Evan Liu. I build apps.</p>
            <p>I like to build things that quickly get many users - which are currently viral apps.</p>
            <p>I'm studying finance + CS at NYU. Currently, I'm getting into embedded.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
