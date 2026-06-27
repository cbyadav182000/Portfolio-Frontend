"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="destructive" onClick={handleLogout}>Logout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Select a module from the sidebar to manage your portfolio.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
