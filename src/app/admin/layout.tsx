import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900">
      {/* Sidebar - we can build a proper navigation later */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block">
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
             <li>
                <Link href="/admin" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">Dashboard</span>
                </Link>
             </li>
             <li>
                <Link href="/admin/media" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">Media</span>
                </Link>
             </li>
             <li>
                <Link href="/admin/settings" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">Settings</span>
                </Link>
             </li>
             <li>
                <Link href="/admin/about" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">About</span>
                </Link>
             </li>
             <li>
                <Link href="/admin/education" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">Education</span>
                </Link>
             </li>
             <li>
                <Link href="/admin/experience" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">Experience</span>
                </Link>
             </li>
             <li>
                <Link href="/admin/projects" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">Projects</span>
                </Link>
             </li>
             <li>
                <Link href="/admin/achievements" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">Achievements</span>
                </Link>
             </li>
             <li>
                <Link href="/admin/contact" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">Contact</span>
                </Link>
             </li>
             <li>
                <Link href="/admin/social" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">Social Links</span>
                </Link>
             </li>
             <li>
                <Link href="/admin/resume" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">Resumes</span>
                </Link>
             </li>
             <li>
                <Link href="/admin/blog" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">Blog</span>
                </Link>
             </li>
             <li>
                <Link href="/admin/faq" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">FAQ</span>
                </Link>
             </li>
             <li>
                <Link href="/admin/rag" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">AI & RAG</span>
                </Link>
             </li>
             <li>
                <Link href="/admin/chat-test" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                   <span className="ms-3">Test Chatbot</span>
                </Link>
             </li>
             {/* We will populate other modules here */}
          </ul>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
