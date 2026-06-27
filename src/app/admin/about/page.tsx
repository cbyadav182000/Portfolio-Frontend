"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, apiFetch } from "@/lib/api";

export default function AboutManagement() {
  const [about, setAbout] = useState({
    title: "",
    biography: "",
    content: "",
    images: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await apiFetch("/api/about/");
        if (res.ok) {
          const data = await res.json();
          setAbout(data);
        }
      } catch (err) {
        console.error("Failed to load about data");
      }
    };
    fetchAbout();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAbout({ ...about, [e.target.id]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await apiFetch("/api/about/", {
        method: "POST",
        body: JSON.stringify(about),
      });
      if (res.ok) {
        setMessage("About information saved successfully!");
      } else {
        setMessage("Error saving about information.");
      }
    } catch (err) {
      setMessage("Error saving about information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">About Management</h1>
      {message && <p className="text-green-600 font-medium">{message}</p>}
      
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>About Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Section Title</Label>
              <Input id="title" value={about.title} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="biography">Short Biography</Label>
              <textarea 
                id="biography" 
                value={about.biography} 
                onChange={handleChange} 
                className="w-full min-h-[100px] flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Rich Content (HTML allowed)</Label>
              <textarea 
                id="content" 
                value={about.content} 
                onChange={handleChange} 
                className="w-full min-h-[300px] font-mono flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              />
            </div>
            {/* Image management would ideally integrate with a media picker here */}
            <div className="space-y-2">
              <Label htmlFor="images">Comma separated image URLs</Label>
              <Input 
                id="images" 
                value={about.images.join(",")} 
                onChange={(e) => setAbout({...about, images: e.target.value.split(",")})} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Button type="submit" disabled={loading} size="lg">Save About Info</Button>
        </div>
      </form>
    </div>
  );
}
