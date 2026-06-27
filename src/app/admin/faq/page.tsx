"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, apiFetch } from "@/lib/api";

interface FAQItem {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  status: boolean;
}

export default function FAQManagement() {
  const [faqList, setFaqList] = useState<FAQItem[]>([]);
  const [formData, setFormData] = useState<FAQItem>({
    question: "", answer: "", category: "General", status: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchFaqs = async () => {
    try {
      const res = await apiFetch("/api/faqs/");
      if (res.ok) setFaqList(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.checked });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/faqs/${editingId}` : "/api/faqs/";
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ question: "", answer: "", category: "General", status: true });
        setEditingId(null);
        await fetchFaqs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: FAQItem) => {
    setEditingId(item._id || null);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
      status: item.status
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await apiFetch(`/api/faqs/${id}`, { method: "DELETE" });
      if (res.ok) await fetchFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">FAQ Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit FAQ" : "Add FAQ"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="question">Question</Label>
              <Input id="question" value={formData.question} onChange={handleChange} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="answer">Answer</Label>
              <textarea 
                id="answer" 
                value={formData.answer} 
                onChange={handleChange} 
                className="w-full min-h-[100px] flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={formData.category} onChange={handleChange} required />
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="status" 
                checked={formData.status} 
                onChange={handleCheckboxChange} 
                className="rounded border-gray-300 text-slate-900 focus:ring-slate-900"
              />
              <Label htmlFor="status">Active (Visible)</Label>
            </div>
            
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit" disabled={loading}>{editingId ? "Update" : "Add"}</Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditingId(null);
                  setFormData({ question: "", answer: "", category: "General", status: true });
                }}>Cancel</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {faqList.map(item => (
          <Card key={item._id}>
            <CardContent className="p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${item.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {item.status ? "Active" : "Hidden"}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">{item.category}</span>
                </div>
                <h3 className="font-bold text-lg">{item.question}</h3>
                <p className="text-gray-600 mt-1">{item.answer}</p>
              </div>
              <div className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-2">
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
