"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  is_published: boolean;
  categories: string[];
  tags: string[];
  created_at: string;
}

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await apiFetch(`/api/blogs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          setError("Blog post not found.");
        }
      } catch (err) {
        setError("Failed to load blog post.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent dark:border-white"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4">
        <h1 className="text-2xl font-bold mb-4">{error || "Blog post not found"}</h1>
        <Link href="/" className="text-zinc-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100 font-sans pb-24">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-black/85">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        {blog.cover_image && (
          <div className="w-full h-[250px] md:h-[400px] relative rounded-3xl overflow-hidden mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blog.cover_image.startsWith("http") ? blog.cover_image : `http://localhost:8000${blog.cover_image}`}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {/* Metadata */}
          <div className="flex flex-wrap gap-4 items-center text-xs text-zinc-500 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {blog.categories.map((cat, i) => (
              <span key={i} className="bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                {cat}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag, i) => (
                <span key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-0.5">
                  <Tag className="h-3 w-3" /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <article className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
            {blog.content}
          </article>
        </div>
      </main>
    </div>
  );
}
