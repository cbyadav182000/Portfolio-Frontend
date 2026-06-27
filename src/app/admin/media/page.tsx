"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, apiFetch } from "@/lib/api";

export default function MediaManagement() {
  const [images, setImages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchMedia = async () => {
    try {
      const imgRes = await apiFetch("/api/media/list/images");
      const docRes = await apiFetch("/api/media/list/documents");
      
      if (imgRes.ok) setImages(await imgRes.json());
      if (docRes.ok) setDocuments(await docRes.json());
    } catch (err) {
      console.error("Failed to fetch media", err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "document") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Create a specific fetch without JSON content-type
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const headers: any = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/media/upload/${type}`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }
      
      await fetchMedia();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (filename: string, type: "image" | "document") => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await apiFetch(`/api/media/delete/${type}/${filename}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchMedia();
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Media Management</h1>
      
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="image-upload">Upload Image</Label>
              <Input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                disabled={uploading}
                onChange={(e) => handleUpload(e, "image")} 
              />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {images.map(img => (
                <div key={img.filename} className="relative group border rounded overflow-hidden">
                  <img src={`${API_URL}${img.url}`} alt={img.filename} className="w-full h-24 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(img.filename, "image")}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="doc-upload">Upload Document</Label>
              <Input 
                id="doc-upload" 
                type="file" 
                accept=".pdf,.doc,.docx" 
                disabled={uploading}
                onChange={(e) => handleUpload(e, "document")} 
              />
            </div>
            
            <div className="space-y-2">
              {documents.map(doc => (
                <div key={doc.filename} className="flex justify-between items-center p-2 border rounded">
                  <a href={`${API_URL}${doc.url}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline truncate mr-2">
                    {doc.filename}
                  </a>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(doc.filename, "document")}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
