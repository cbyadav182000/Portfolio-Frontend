"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, apiFetch } from "@/lib/api";

export default function SettingsManagement() {
  const [settings, setSettings] = useState({
    title: "",
    description: "",
    logoUrl: "",
    heroTitle: "",
    heroSubtitle: "",
    heroImageUrl: "",
    seoKeywords: "",
    themePrimaryColor: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiFetch("/api/settings/");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to load settings");
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.id]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await apiFetch("/api/settings/", {
        method: "POST",
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage("Settings saved successfully!");
      } else {
        setMessage("Error saving settings.");
      }
    } catch (err) {
      setMessage("Error saving settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Website Settings</h1>
      {message && <p className="text-green-600 font-medium">{message}</p>}
      
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Global Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Website Title</Label>
              <Input id="title" value={settings.title} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Website Description (SEO)</Label>
              <Input id="description" value={settings.description} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL (Upload from Media)</Label>
              <Input id="logoUrl" value={settings.logoUrl || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoKeywords">SEO Keywords</Label>
              <Input id="seoKeywords" value={settings.seoKeywords} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input id="heroTitle" value={settings.heroTitle} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Input id="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroImageUrl">Hero Image URL</Label>
              <Input id="heroImageUrl" value={settings.heroImageUrl || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="themePrimaryColor">Theme Primary Color</Label>
              <Input id="themePrimaryColor" type="color" value={settings.themePrimaryColor} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Button type="submit" disabled={loading} size="lg">Save Settings</Button>
        </div>
      </form>
    </div>
  );
}
