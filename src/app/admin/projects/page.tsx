"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, apiFetch } from "@/lib/api";

interface ProjectItem {
  _id?: string;
  title: string;
  description: string;
  screenshots: string[];
  tech_stack: string[];
  github_url: string;
  live_url: string;
}

export default function ProjectsManagement() {
  const [projectList, setProjectList] = useState<ProjectItem[]>([]);
  const [formData, setFormData] = useState<ProjectItem>({
    title: "", description: "", screenshots: [], tech_stack: [], github_url: "", live_url: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await apiFetch("/api/projects/");
      if (res.ok) setProjectList(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: "screenshots" | "tech_stack") => {
    setFormData({ ...formData, [field]: e.target.value.split(",").map(s => s.trim()).filter(s => s) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects/";
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ title: "", description: "", screenshots: [], tech_stack: [], github_url: "", live_url: "" });
        setEditingId(null);
        await fetchProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: ProjectItem) => {
    setEditingId(item._id || null);
    setFormData({
      title: item.title,
      description: item.description,
      screenshots: item.screenshots || [],
      tech_stack: item.tech_stack || [],
      github_url: item.github_url || "",
      live_url: item.live_url || ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await apiFetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) await fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Projects Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Project" : "Add Project"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="w-full min-h-[100px] flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                required 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="screenshots">Screenshots (comma separated URLs)</Label>
              <Input id="screenshots" value={formData.screenshots.join(", ")} onChange={(e) => handleArrayChange(e, "screenshots")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tech_stack">Tech Stack (comma separated)</Label>
              <Input id="tech_stack" value={formData.tech_stack.join(", ")} onChange={(e) => handleArrayChange(e, "tech_stack")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input id="github_url" value={formData.github_url} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="live_url">Live URL</Label>
              <Input id="live_url" value={formData.live_url} onChange={handleChange} />
            </div>
            
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit" disabled={loading}>{editingId ? "Update" : "Add"}</Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditingId(null);
                  setFormData({ title: "", description: "", screenshots: [], tech_stack: [], github_url: "", live_url: "" });
                }}>Cancel</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projectList.map(item => (
          <Card key={item._id}>
            <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
              <div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                <div className="mt-2 text-xs font-mono text-blue-600">{item.tech_stack.join(" · ")}</div>
              </div>
              <div className="flex space-x-2 justify-end">
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
