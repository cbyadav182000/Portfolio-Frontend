"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, apiFetch } from "@/lib/api";

export default function ContactManagement() {
  const [contact, setContact] = useState({
    phone: "",
    email: "",
    whatsapp: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await apiFetch("/api/contact/");
        if (res.ok) {
          const data = await res.json();
          setContact(data);
        }
      } catch (err) {
        console.error("Failed to load contact data");
      }
    };
    fetchContact();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact({ ...contact, [e.target.id]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await apiFetch("/api/contact/", {
        method: "POST",
        body: JSON.stringify(contact),
      });
      if (res.ok) {
        setMessage("Contact information saved successfully!");
      } else {
        setMessage("Error saving contact information.");
      }
    } catch (err) {
      setMessage("Error saving contact information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Contact Management</h1>
      {message && <p className="text-green-600 font-medium">{message}</p>}
      
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={contact.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={contact.phone} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input id="whatsapp" value={contact.whatsapp} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={contact.address} onChange={handleChange} required />
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Button type="submit" disabled={loading} size="lg">Save Contact Info</Button>
        </div>
      </form>
    </div>
  );
}
