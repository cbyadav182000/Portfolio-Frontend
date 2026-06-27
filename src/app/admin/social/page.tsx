"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, apiFetch } from "@/lib/api";

export default function SocialManagement() {
  const [social, setSocial] = useState({
    github: "",
    linkedin: "",
    instagram: "",
    twitter: "",
    youtube: "",
    portfolio: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSocial = async () => {
      try {
        const res = await apiFetch("/api/social/");
        if (res.ok) {
          const data = await res.json();
          setSocial(data);
        }
      } catch (err) {
        console.error("Failed to load social data");
      }
    };
    fetchSocial();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocial({ ...social, [e.target.id]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await apiFetch("/api/social/", {
        method: "POST",
        body: JSON.stringify(social),
      });
      if (res.ok) {
        setMessage("Social links saved successfully!");
      } else {
        setMessage("Error saving social links.");
      }
    } catch (err) {
      setMessage("Error saving social links.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Social Links</h1>
      {message && <p className="text-green-600 font-medium">{message}</p>}
      
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Social Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" value={social.github} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" value={social.linkedin} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input id="twitter" value={social.twitter} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" value={social.instagram} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input id="youtube" value={social.youtube} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio (Other links)</Label>
              <Input id="portfolio" value={social.portfolio} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Button type="submit" disabled={loading} size="lg">Save Social Links</Button>
        </div>
      </form>
    </div>
  );
}
