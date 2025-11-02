import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";

type Post = {
  id: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  created_at: string;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
  } | null;
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { user, profile } = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  const { data: post } = await supabase
    .from("posts")
    .select("id, title, content, slug, published, created_at")
    .eq("slug", slug)
    .single();

  if (!post) {
    redirect("/blog");
  }

  // Fetch comments
  const { data: commentsData } = await supabase
    .from("comments")
    .select("id, content, created_at, user_id")
    .eq("post_id", post.id)
    .order("created_at", { ascending: true });

  // Fetch profiles for the comment authors
  const userIds = commentsData?.map(c => c.user_id) || [];
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, username")
    .in("id", userIds);

  // Map profiles to comments
  const profilesMap = new Map(profilesData?.map(p => [p.id, p.username]) || []);
  const comments = commentsData?.map(c => ({
    ...c,
    profiles: { username: profilesMap.get(c.user_id) || null }
  })) || [];

  async function createComment(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      redirect("/auth/login");
    }

    if (!post) {
      redirect("/blog");
    }

    const content = String(formData.get("content") || "").trim();
    if (!content) {
      return;
    }

    const { error } = await supabase.from("comments").insert({
      content,
      user_id: auth.user.id,
      post_id: post.id,
    });

    if (error) {
      console.error("Error creating comment:", error);
      return;
    }

    revalidatePath(`/blog/${slug}`);
    redirect(`/blog/${slug}#comments`);
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

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Post Title with Edit Button */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <h1 className="text-xl font-medium text-center">{post.title}</h1>
          {isAdmin && (
            <Link 
              href={`/blog/${slug}/edit`}
              className="text-sm text-blue-500 hover:text-blue-400 underline transition-colors"
            >
              edit
            </Link>
          )}
        </div>

        {/* Post Content */}
        <article className="space-y-4 mb-12">
          {post.content.split('\n').map((line: string, i: number) => (
            line.trim() ? (
              <p key={i} className="text-sm">{line}</p>
            ) : null
          ))}
        </article>

        {/* Comment Link for Non-Logged-In Users */}
        {!user && (
          <div className="mb-12">
            <Link 
              href="/auth/login" 
              className="text-sm text-blue-500 hover:text-blue-400 underline transition-colors"
            >
              comment
            </Link>
          </div>
        )}

        {/* Comments Section */}
        <section id="comments" className="mt-16">
          {/* Comment Form - Only show if user is logged in */}
          {user && (
            <form action={createComment} className="mb-8">
              <textarea
                name="content"
                placeholder="Write a comment..."
                className="w-full h-12 bg-muted rounded px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-border mb-4"
              />
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {profile?.username || 'commentor'}
                </span>
                <button 
                  type="submit"
                  className="text-sm text-blue-500 hover:text-blue-400 underline transition-colors"
                >
                  submit
                </button>
              </div>
            </form>
          )}

          {/* Comments List - Always visible */}
          <div className="space-y-6">
            {comments?.length ? (
              comments.map((c) => (
                <div key={c.id} className="text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground mb-2">
                    <span className="font-medium">
                      {c.profiles?.username || 'Anonymous'}
                    </span>
                    <span className="text-xs">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div>{c.content}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No comments yet.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}



