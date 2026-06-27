"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, apiFetch } from "@/lib/api";

interface AchievementItem {
  _id?: string;
  title: string;
  description: string;
  type: string;
  date: string;
  images: string[];
  url: string;
}

export default function AchievementsManagement() {
  const [achievementList, setAchievementList] = useState<AchievementItem[]>([]);
  const [formData, setFormData] = useState<AchievementItem>({
    title: "", description: "", type: "Certificate", date: "", images: [], url: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAchievements = async () => {
    try {
      const res = await apiFetch("/api/achievements/");
      if (res.ok) setAchievementList(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: "images") => {
    setFormData({ ...formData, [field]: e.target.value.split(",").map(s => s.trim()).filter(s => s) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/achievements/${editingId}` : "/api/achievements/";
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ title: "", description: "", type: "Certificate", date: "", images: [], url: "" });
        setEditingId(null);
        await fetchAchievements();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: AchievementItem) => {
    setEditingId(item._id || null);
    setFormData({
      title: item.title,
      description: item.description,
      type: item.type,
      date: item.date,
      images: item.images || [],
      url: item.url || ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await apiFetch(`/api/achievements/${id}`, { method: "DELETE" });
      if (res.ok) await fetchAchievements();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Achievements Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Achievement" : "Add Achievement"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select 
                id="type" 
                value={formData.type} 
                onChange={handleChange} 
                className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
              >
                <option value="Certificate">Certificate</option>
                <option value="Award">Award</option>
                <option value="Competition">Competition</option>
                <option value="General">General Achievement</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL (Optional Link)</Label>
              <Input id="url" value={formData.url} onChange={handleChange} />
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
              <Label htmlFor="images">Images (comma separated URLs for Gallery)</Label>
              <Input id="images" value={formData.images.join(", ")} onChange={(e) => handleArrayChange(e, "images")} />
            </div>
            
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit" disabled={loading}>{editingId ? "Update" : "Add"}</Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditingId(null);
                  setFormData({ title: "", description: "", type: "Certificate", date: "", images: [], url: "" });
                }}>Cancel</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {achievementList.map(item => (
          <Card key={item._id}>
            <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">{item.type}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                <p className="text-xs text-gray-500 mt-2">{item.date}</p>
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
