import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

type Post = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
};

export default async function BlogIndexPage() {
  const supabase = await createClient();
  const { profile, user } = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  let posts: Post[] = [];
  if (isAdmin) {
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, published, created_at")
      .order("created_at", { ascending: false });
    posts = (data ?? []) as Post[];
  } else {
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, published, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    posts = (data ?? []) as Post[];
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="w-full border-b border-border">
        <nav className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Link 
              href="/blog" 
              className="text-sm font-medium hover:text-muted-foreground transition-colors"
            >
              blog
            </Link>
            <div className="flex items-center gap-8">
              <Link 
                href="/" 
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                index
              </Link>
              {!user ? (
                <Link 
                  href="/auth/login" 
                  className="text-sm font-medium hover:text-muted-foreground transition-colors"
                >
                  login
                </Link>
              ) : isAdmin ? (
                <form action="/auth/sign-out" method="post">
                  <button 
                    type="submit"
                    className="text-sm font-medium hover:text-muted-foreground transition-colors"
                  >
                    logout (admin)
                  </button>
                </form>
              ) : (
                <form action="/auth/sign-out" method="post">
                  <button 
                    type="submit"
                    className="text-sm font-medium hover:text-muted-foreground transition-colors"
                  >
                    logout
                  </button>
                </form>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Create Link - centered (admin only) */}
      {isAdmin && (
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <Link 
              href="/blog/create" 
              className="text-sm text-blue-500 hover:text-blue-400 underline transition-colors"
            >
              create
            </Link>
          </div>
        </div>
      )}
      
      <main className={`max-w-4xl mx-auto px-6 pb-16 ${isAdmin ? 'pt-0' : 'pt-24'}`}>
        <div className="space-y-3">
          {posts.length === 0 ? (
            <>
              {/* Placeholder entries when no posts exist */}
              <div className="flex gap-12 text-sm">
                <span className="text-muted-foreground w-12 flex-shrink-0">2025</span>
                <span>entry 1 extra text</span>
              </div>
              <div className="flex gap-12 text-sm">
                <span className="text-muted-foreground w-12 flex-shrink-0">2025</span>
                <span>entry 2 some more text</span>
              </div>
              <div className="flex gap-12 text-sm">
                <span className="text-muted-foreground w-12 flex-shrink-0">2025</span>
                <span>entry 1 text</span>
              </div>
              <div className="flex gap-12 text-sm">
                <span className="text-muted-foreground w-12 flex-shrink-0">2024</span>
                <span>entry 1 spaced text</span>
              </div>
            </>
          ) : (
            posts.map((post) => {
              const year = new Date(post.created_at).getFullYear();
              return (
                <div key={post.id} className="flex gap-12 text-sm">
                  <span className="text-muted-foreground w-12 flex-shrink-0">{year}</span>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="hover:text-muted-foreground transition-colors flex-1"
                  >
                    {post.title}
                    {!post.published && isAdmin && (
                      <span className="ml-2 text-xs text-yellow-500">(draft)</span>
                    )}
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}



