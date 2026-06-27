"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, apiFetch } from "@/lib/api";

interface RAGDocument {
  _id?: string;
  name: string;
  url: string;
  status: string;
}

export default function RAGManagement() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [documents, setDocuments] = useState<RAGDocument[]>([]);
  const [formData, setFormData] = useState({ name: "", url: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [syncing, setSyncing] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await apiFetch("/api/rag/settings");
      if (res.ok) {
        const data = await res.json();
        setSystemPrompt(data.system_prompt || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await apiFetch("/api/rag/documents");
      if (res.ok) setDocuments(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchDocuments();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await apiFetch("/api/rag/settings", {
        method: "POST",
        body: JSON.stringify({ system_prompt: systemPrompt }),
      });
      if (res.ok) setMessage("System prompt saved.");
    } catch (err) {
      setMessage("Error saving settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch("/api/rag/documents", {
        method: "POST",
        body: JSON.stringify({ ...formData, status: "Unsynced" }),
      });
      if (res.ok) {
        setFormData({ name: "", url: "" });
        await fetchDocuments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await apiFetch(`/api/rag/documents/${id}`, { method: "DELETE" });
      if (res.ok) await fetchDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage("");
    try {
      const res = await apiFetch("/api/rag/sync", { method: "POST" });
      if (res.ok) {
        setMessage("Database synced successfully!");
        await fetchDocuments();
      } else {
        setMessage("Error syncing database.");
      }
    } catch (err) {
      setMessage("Error syncing database.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">AI & RAG Management</h1>
      {message && <p className="text-blue-600 font-medium">{message}</p>}
      
      <Card>
        <CardHeader>
          <CardTitle>AI Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system_prompt">System Prompt</Label>
              <textarea 
                id="system_prompt" 
                value={systemPrompt} 
                onChange={(e) => setSystemPrompt(e.target.value)} 
                className="w-full min-h-[120px] flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                required 
              />
              <p className="text-xs text-gray-500">This instructs the Gemini model on how to behave.</p>
            </div>
            <Button type="submit" disabled={loading}>Save Settings</Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">RAG Documents (Context)</h2>
        <Button onClick={handleSync} disabled={syncing}>
          {syncing ? "Syncing..." : "Sync Database"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Document</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddDocument} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label htmlFor="doc_name">Document Name</Label>
              <Input id="doc_name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="doc_url">Document URL (PDF/TXT)</Label>
              <Input id="doc_url" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} required />
            </div>
            <Button type="submit" disabled={loading}>Add</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map(doc => (
          <Card key={doc._id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold">{doc.name}</h3>
                <a href={doc.url.startsWith("http") ? doc.url : `${API_URL}${doc.url}`} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">
                  {doc.url}
                </a>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${doc.status === "Synced" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {doc.status}
                  </span>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteDocument(doc._id!)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
