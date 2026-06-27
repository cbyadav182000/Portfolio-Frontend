"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, apiFetch } from "@/lib/api";

interface EducationItem {
  _id?: string;
  institute_name: string;
  degree: string;
  start_date: string;
  end_date: string;
  description: string;
  images: string[];
  certificates: string[];
}

export default function EducationManagement() {
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [formData, setFormData] = useState<EducationItem>({
    institute_name: "", degree: "", start_date: "", end_date: "", description: "", images: [], certificates: []
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEducation = async () => {
    try {
      const res = await apiFetch("/api/education/");
      if (res.ok) setEducationList(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: "images" | "certificates") => {
    setFormData({ ...formData, [field]: e.target.value.split(",").map(s => s.trim()).filter(s => s) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/education/${editingId}` : "/api/education/";
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ institute_name: "", degree: "", start_date: "", end_date: "", description: "", images: [], certificates: [] });
        setEditingId(null);
        await fetchEducation();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: EducationItem) => {
    setEditingId(item._id || null);
    setFormData({
      institute_name: item.institute_name,
      degree: item.degree,
      start_date: item.start_date,
      end_date: item.end_date || "",
      description: item.description,
      images: item.images || [],
      certificates: item.certificates || []
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await apiFetch(`/api/education/${id}`, { method: "DELETE" });
      if (res.ok) await fetchEducation();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Education Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Education" : "Add Education"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institute_name">Institute Name</Label>
              <Input id="institute_name" value={formData.institute_name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input id="degree" value={formData.degree} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input id="start_date" type="date" value={formData.start_date} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input id="end_date" type="date" value={formData.end_date} onChange={handleChange} />
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
              <Label htmlFor="images">Images (comma separated URLs for gallery/slider)</Label>
              <Input id="images" value={formData.images.join(", ")} onChange={(e) => handleArrayChange(e, "images")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="certificates">Certificates (comma separated Document URLs)</Label>
              <Input id="certificates" value={formData.certificates.join(", ")} onChange={(e) => handleArrayChange(e, "certificates")} />
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit" disabled={loading}>{editingId ? "Update" : "Add"}</Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditingId(null);
                  setFormData({ institute_name: "", degree: "", start_date: "", end_date: "", description: "", images: [], certificates: [] });
                }}>Cancel</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {educationList.map(item => (
          <Card key={item._id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{item.institute_name}</h3>
                <p className="text-gray-600">{item.degree}</p>
                <p className="text-sm text-gray-500">{item.start_date} - {item.end_date || "Present"}</p>
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
