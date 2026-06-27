"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, apiFetch } from "@/lib/api";

interface ResumeItem {
  _id?: string;
  name: string;
  url: string;
  is_active: boolean;
}

export default function ResumeManagement() {
  const [resumeList, setResumeList] = useState<ResumeItem[]>([]);
  const [formData, setFormData] = useState<ResumeItem>({
    name: "", url: "", is_active: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchResumes = async () => {
    try {
      const res = await apiFetch("/api/resumes/");
      if (res.ok) setResumeList(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.checked });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await apiFetch("/api/resumes/", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ name: "", url: "", is_active: false });
        setMessage("Resume added successfully.");
        await fetchResumes();
      } else {
        setMessage("Error adding resume.");
      }
    } catch (err) {
      setMessage("Error adding resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      const res = await apiFetch(`/api/resumes/${id}/activate`, { method: "PUT" });
      if (res.ok) await fetchResumes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await apiFetch(`/api/resumes/${id}`, { method: "DELETE" });
      if (res.ok) await fetchResumes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Resume Management</h1>
      {message && <p className="text-blue-600 font-medium">{message}</p>}
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Resume Name (e.g., Full Stack 2026)</Label>
              <Input id="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Resume URL (from Media Uploads)</Label>
              <Input id="url" value={formData.url} onChange={handleChange} required />
            </div>
            <div className="flex items-center space-x-2 md:col-span-2">
              <input 
                type="checkbox" 
                id="is_active" 
                checked={formData.is_active} 
                onChange={handleCheckboxChange} 
                className="rounded border-gray-300 text-slate-900 focus:ring-slate-900"
              />
              <Label htmlFor="is_active">Make this the active/default resume</Label>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading}>Add Resume</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resumeList.map(item => (
          <Card key={item._id} className={item.is_active ? "border-green-500 border-2" : ""}>
            <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  {item.is_active && <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Active</span>}
                </div>
                <a href={item.url.startsWith("http") ? item.url : `${API_URL}${item.url}`} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline break-all">
                  {item.url}
                </a>
              </div>
              <div className="flex space-x-2 justify-end mt-4">
                {!item.is_active && (
                  <Button variant="outline" size="sm" onClick={() => handleActivate(item._id!)}>Make Active</Button>
                )}
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id!)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
