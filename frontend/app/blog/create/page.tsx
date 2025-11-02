import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default async function CreatePostPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  async function createPost(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      redirect("/auth/login");
    }

    const title = String(formData.get("title") || "").trim();
    const content = String(formData.get("content") || "").trim();
    const inputSlug = String(formData.get("slug") || "").trim();
    const published = String(formData.get("published") || "") === "on";

    if (!title || !content) {
      return;
    }

    const slug = inputSlug ? slugify(inputSlug) : slugify(title);
    if (!slug) {
      return;
    }

    const { error } = await supabase.from("posts").insert({
      title,
      content,
      slug,
      published,
      user_id: auth.user.id,
    });

    if (error) {
      return;
    }

    revalidatePath("/blog");
    redirect(`/blog/${slug}`);
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
              {auth?.user && (
                <form action="/auth/sign-out" method="post">
                  <button 
                    type="submit"
                    className="text-sm font-medium hover:text-muted-foreground transition-colors"
                  >
                    logout (admin)
                  </button>
                </form>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <form action={createPost} className="space-y-8">
          {/* Title input */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-medium">post:</span>
            <input
              type="text"
              name="title"
              required
              placeholder="title"
              className="flex-1 text-xl font-medium bg-transparent border-none outline-none focus:outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Content textarea - large gray box */}
          <textarea
            name="content"
            required
            placeholder="Write your post content here..."
            className="w-full h-48 bg-muted rounded px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-border"
          />

          {/* Publish checkbox */}
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="published" 
              name="published"
              className="w-4 h-4"
            />
            <label htmlFor="published" className="text-sm">
              Publish immediately
            </label>
          </div>
          
          <button 
            type="submit"
            className="text-sm text-blue-500 hover:text-blue-400 underline transition-colors"
          >
            submit
          </button>
        </form>
      </main>
    </div>
  );
}



