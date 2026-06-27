"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, apiFetch } from "@/lib/api";

interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  is_published: boolean;
  categories: string[];
  tags: string[];
  seo_title: string;
  seo_description: string;
  created_at?: string;
  updated_at?: string;
}

export default function BlogManagement() {
  const [blogList, setBlogList] = useState<BlogPost[]>([]);
  const [formData, setFormData] = useState<BlogPost>({
    title: "", slug: "", content: "", excerpt: "", cover_image: "", is_published: false,
    categories: [], tags: [], seo_title: "", seo_description: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await apiFetch("/api/blogs/");
      if (res.ok) setBlogList(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (e.target.id === "title" && !editingId) {
      // Auto-generate slug
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      setFormData({ ...formData, title: value, slug });
    } else {
      setFormData({ ...formData, [e.target.id]: value });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.checked });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: "categories" | "tags") => {
    setFormData({ ...formData, [field]: e.target.value.split(",").map(s => s.trim()).filter(s => s) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/blogs/${editingId}` : "/api/blogs/";
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ title: "", slug: "", content: "", excerpt: "", cover_image: "", is_published: false, categories: [], tags: [], seo_title: "", seo_description: "" });
        setEditingId(null);
        await fetchBlogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: BlogPost) => {
    setEditingId(item._id || null);
    setFormData({
      title: item.title,
      slug: item.slug,
      content: item.content,
      excerpt: item.excerpt || "",
      cover_image: item.cover_image || "",
      is_published: item.is_published,
      categories: item.categories || [],
      tags: item.tags || [],
      seo_title: item.seo_title || "",
      seo_description: item.seo_description || ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await apiFetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) await fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Blog Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Post" : "Create Post"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" value={formData.slug} onChange={handleChange} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <textarea 
                id="excerpt" 
                value={formData.excerpt} 
                onChange={handleChange} 
                className="w-full min-h-[60px] flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="content">Content (Markdown / HTML)</Label>
              <textarea 
                id="content" 
                value={formData.content} 
                onChange={handleChange} 
                className="w-full min-h-[200px] flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categories">Categories (comma separated)</Label>
              <Input id="categories" value={formData.categories.join(", ")} onChange={(e) => handleArrayChange(e, "categories")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={formData.tags.join(", ")} onChange={(e) => handleArrayChange(e, "tags")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input id="seo_title" value={formData.seo_title} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo_description">SEO Description</Label>
              <Input id="seo_description" value={formData.seo_description} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cover_image">Cover Image URL</Label>
              <Input id="cover_image" value={formData.cover_image} onChange={handleChange} />
            </div>
            <div className="flex items-center space-x-2 md:col-span-2">
              <input 
                type="checkbox" 
                id="is_published" 
                checked={formData.is_published} 
                onChange={handleCheckboxChange} 
                className="rounded border-gray-300 text-slate-900 focus:ring-slate-900"
              />
              <Label htmlFor="is_published">Publish immediately (Otherwise Draft)</Label>
            </div>
            
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit" disabled={loading}>{editingId ? "Update Post" : "Create Post"}</Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditingId(null);
                  setFormData({ title: "", slug: "", content: "", excerpt: "", cover_image: "", is_published: false, categories: [], tags: [], seo_title: "", seo_description: "" });
                }}>Cancel</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogList.map(item => (
          <Card key={item._id}>
            <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${item.is_published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {item.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{item.excerpt}</p>
                <div className="mt-2 text-xs text-gray-500">Slug: {item.slug}</div>
              </div>
              <div className="flex space-x-2 justify-end mt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id!)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
