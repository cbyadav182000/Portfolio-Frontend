"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, apiFetch } from "@/lib/api";

interface ExperienceItem {
  _id?: string;
  company: string;
  position: string;
  duration: string;
  responsibilities: string;
  images: string[];
  documents: string[];
  experience_letter: string;
  offer_letter: string;
}

export default function ExperienceManagement() {
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);
  const [formData, setFormData] = useState<ExperienceItem>({
    company: "", position: "", duration: "", responsibilities: "", images: [], documents: [], experience_letter: "", offer_letter: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchExperience = async () => {
    try {
      const res = await apiFetch("/api/experience/");
      if (res.ok) setExperienceList(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: "images" | "documents") => {
    setFormData({ ...formData, [field]: e.target.value.split(",").map(s => s.trim()).filter(s => s) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/experience/${editingId}` : "/api/experience/";
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ company: "", position: "", duration: "", responsibilities: "", images: [], documents: [], experience_letter: "", offer_letter: "" });
        setEditingId(null);
        await fetchExperience();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: ExperienceItem) => {
    setEditingId(item._id || null);
    setFormData({
      company: item.company,
      position: item.position,
      duration: item.duration,
      responsibilities: item.responsibilities,
      images: item.images || [],
      documents: item.documents || [],
      experience_letter: item.experience_letter || "",
      offer_letter: item.offer_letter || ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await apiFetch(`/api/experience/${id}`, { method: "DELETE" });
      if (res.ok) await fetchExperience();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Experience Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Experience" : "Add Experience"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={formData.company} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" value={formData.position} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (e.g. Jan 2020 - Present)</Label>
              <Input id="duration" value={formData.duration} onChange={handleChange} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="responsibilities">Responsibilities</Label>
              <textarea 
                id="responsibilities" 
                value={formData.responsibilities} 
                onChange={handleChange} 
                className="w-full min-h-[100px] flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                required 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="images">Images (comma separated URLs)</Label>
              <Input id="images" value={formData.images.join(", ")} onChange={(e) => handleArrayChange(e, "images")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="documents">Documents (comma separated URLs)</Label>
              <Input id="documents" value={formData.documents.join(", ")} onChange={(e) => handleArrayChange(e, "documents")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience_letter">Experience Letter URL</Label>
              <Input id="experience_letter" value={formData.experience_letter} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offer_letter">Offer Letter URL</Label>
              <Input id="offer_letter" value={formData.offer_letter} onChange={handleChange} />
            </div>
            
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit" disabled={loading}>{editingId ? "Update" : "Add"}</Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditingId(null);
                  setFormData({ company: "", position: "", duration: "", responsibilities: "", images: [], documents: [], experience_letter: "", offer_letter: "" });
                }}>Cancel</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {experienceList.map(item => (
          <Card key={item._id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{item.company}</h3>
                <p className="text-gray-600">{item.position}</p>
                <p className="text-sm text-gray-500">{item.duration}</p>
              </div>
              <div className="space-x-2">
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
