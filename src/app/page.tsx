"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Award, 
  Mail, 
  Phone, 
  MapPin, 
  Download, 
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Globe,
  Sparkles,
  Database,
  Terminal,
  Layers,
  CheckCircle2,
  Calendar,
  Clock,
  BookOpen,
  MessageSquare,
  ArrowUpRight
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import Chatbot from "@/components/chatbot";

interface WebsiteSettings {
  title: string;
  description: string;
  logoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl?: string;
  themePrimaryColor?: string;
}

interface AboutData {
  title: string;
  biography: string;
  content: string;
  images: string[];
}

interface EducationItem {
  _id: string;
  institute_name: string;
  degree: string;
  start_date: string;
  end_date?: string;
  description: string;
  images: string[];
  certificates: string[];
}

interface ExperienceItem {
  _id: string;
  company: string;
  position: string;
  duration: string;
  responsibilities: string;
  images: string[];
  documents: string[];
  experience_letter?: string;
  offer_letter?: string;
}

interface ProjectItem {
  _id: string;
  title: string;
  description: string;
  screenshots: string[];
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
}

interface AchievementItem {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  certificates: string[];
}

interface ResumeItem {
  _id: string;
  title: string;
  file_url: string;
  is_active: boolean;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  is_published: boolean;
  categories: string[];
  tags: string[];
  created_at: string;
}

interface ContactData {
  phone?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
}

interface SocialLinks {
  github?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  portfolio?: string;
}

// PREMIUM SaaS Default Datasets (Stripe/Linear aesthetics)
const defaultSettings: WebsiteSettings = {
  title: "Chandrabhan Yadav",
  description: "AI Engineer & Full Stack Developer | SaaS Platform Portfolio",
  heroTitle: "Chandrabhan Yadav",
  heroSubtitle: "Specialized in Agentic AI, RAG Systems, FastAPI, Next.js and Enterprise Chatbots.\n\nBuilt AI-powered applications, automation systems and production-grade web platforms.",
  heroImageUrl: "/images/chandrabhan-hero.png"
};

const defaultAbout: AboutData = {
  title: "Executive Profile",
  biography: "I am a Principal AI Engineer & Software Architect specializing in designing enterprise-grade agentic workflows, scalable vector databases, and responsive React ecosystems. I bridge deep backend systems with fluid, pixel-perfect interfaces.",
  content: "Leveraging extensive experience in developing large language model (LLM) interfaces, RAG architectures, and custom FastAPI microservices. I focus on modular design principles, high concurrency performance, and user-centric flows.",
  images: ["/images/about-1.png", "/images/about-2.png"]
};

const defaultExperience: ExperienceItem[] = [
  {
    _id: "default-exp-1",
    company: "Mobiloitte",
    position: "Trainee Software Engineer",
    duration: "Aug 2025 - Jun 2026",
    responsibilities: "• Developed RAG-based enterprise chatbots reducing query latency by 40%.\n• Built and documented modular microservices handling 10k+ daily API requests.\n• Integrated vectorized document search using FastAPI, Motor (MongoDB), and LangChain.\n• Programmed highly interactive user dashboards in React & Next.js.",
    images: ["/images/project-1.png"],
    documents: []
  },
  {
    _id: "default-exp-2",
    company: "AI Innovations Inc.",
    position: "Lead Full Stack Architect",
    duration: "2023 - 2025",
    responsibilities: "• Engineered custom pipeline agents utilizing Gemini models and function calling.\n• Managed Docker-based microservices containerization and Kubernetes orchestration.\n• Reduced database indexing latency by 50% using structured aggregation pipelines.",
    images: ["/images/project-2.png"],
    documents: []
  }
];

const defaultEducation: EducationItem[] = [
  {
    _id: "default-edu-1",
    institute_name: "Stanford University",
    degree: "M.S. in Computer Science",
    start_date: "2018",
    end_date: "2020",
    description: "Specialized in Artificial Intelligence and Distributed Systems. Thesis on scalable vector search indexing.",
    images: ["/images/about-1.png"],
    certificates: []
  },
  {
    _id: "default-edu-2",
    institute_name: "University of California, Berkeley",
    degree: "B.S. in Computer Science",
    start_date: "2014",
    end_date: "2018",
    description: "Completed coursework on Distributed Architectures, Relational Databases, and Advanced Software Engineering.",
    images: ["/images/about-2.png"],
    certificates: []
  }
];

const defaultProjects: ProjectItem[] = [
  {
    _id: "default-proj-1",
    title: "AI-Powered Analytics Suite",
    description: "Enterprise operations dashboard analyzing real-time server telemetry and anomaly detection via vectorized embeddings.",
    tech_stack: ["Next.js", "FastAPI", "MongoDB", "Tailwind CSS"],
    screenshots: ["/images/project-1.png"],
    github_url: "#",
    live_url: "#"
  },
  {
    _id: "default-proj-2",
    title: "Collaborative Canvas Hub",
    description: "A secure real-time collaboration whiteboard using WebSockets, canvas state sync, and revision tracking.",
    tech_stack: ["TypeScript", "WebSockets", "HTML5 Canvas"],
    screenshots: ["/images/project-2.png"],
    github_url: "#",
    live_url: "#"
  }
];

const defaultAchievements: AchievementItem[] = [
  {
    _id: "default-ach-1",
    title: "Technical Excellence Leadership",
    issuer: "AI Innovations Inc.",
    date: "2024",
    description: "Awarded for exceptional leadership in migrating legacy monolithic systems to serverless edge architectures.",
    certificates: ["/images/project-1.png"]
  },
  {
    _id: "default-ach-2",
    title: "Hackathon Winner: Advanced AI agent",
    issuer: "Global Tech Summit",
    date: "2022",
    description: "Developed an autonomous workspace assistant solving real-time document queries in under 3 seconds.",
    certificates: ["/images/project-2.png"]
  }
];

const defaultBlogs: BlogPost[] = [
  {
    _id: "default-blog-1",
    title: "The Rise of Edge-First Web Applications",
    slug: "edge-first-web-apps",
    excerpt: "An in-depth exploration of how edge runtime platforms are changing modern full-stack web applications.",
    content: "Edge runtimes allow us to run serverless functions closest to our users, resulting in near-zero latency...",
    is_published: true,
    categories: ["Web Development"],
    tags: ["Serverless", "Next.js"],
    created_at: new Date().toISOString()
  },
  {
    _id: "default-blog-2",
    title: "Designing Robust FastAPI Routers",
    slug: "fastapi-routers",
    excerpt: "Best practices for modularizing, documenting, and scaling REST API codebases using FastAPI dependencies.",
    content: "FastAPI dependencies are incredibly powerful for injecting database sessions, auth, and validations...",
    is_published: true,
    categories: ["Backend Development"],
    tags: ["FastAPI", "Python"],
    created_at: new Date().toISOString()
  }
];

const defaultContact: ContactData = {
  phone: "+1 (555) 304-9844",
  email: "hello@alexdev.io",
  address: "San Francisco, CA"
};

const defaultSocials: SocialLinks = {
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com"
};

// Skill Categories Matrix
const skillCategories = [
  {
    category: "AI & Agents",
    skills: ["RAG Systems", "LangChain", "Gemini API", "Vector Embeddings", "LLM Fine-tuning"]
  },
  {
    category: "Backend Architecture",
    skills: ["FastAPI", "Python", "REST APIs", "gRPC", "Authentication (JWT)"]
  },
  {
    category: "Frontend engineering",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Design Systems"]
  },
  {
    category: "Data & Storage",
    skills: ["MongoDB", "Motor", "PostgreSQL", "Redis", "Pinecone"]
  },
  {
    category: "DevOps & Cloud",
    skills: ["Docker", "Git", "Kubernetes", "AWS", "Vercel"]
  }
];

export default function Home() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [contact, setContact] = useState<ContactData | null>(null);
  const [socials, setSocials] = useState<SocialLinks | null>(null);

  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Certificate Modal State
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [formStatus, setFormStatus] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMsg.trim()) {
      setFormStatus("error");
      return;
    }
    setFormStatus("success");
    setFormName("");
    setFormEmail("");
    setFormMsg("");
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["projects", "experience", "skills", "about", "education", "achievements", "blog", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          resSettings,
          resAbout,
          resEducation,
          resExperience,
          resProjects,
          resAchievements,
          resResumes,
          resBlogs,
          resContact,
          resSocials
        ] = await Promise.all([
          apiFetch("/api/settings/"),
          apiFetch("/api/about/"),
          apiFetch("/api/education/"),
          apiFetch("/api/experience/"),
          apiFetch("/api/projects/"),
          apiFetch("/api/achievements/"),
          apiFetch("/api/resumes/"),
          apiFetch("/api/blogs/"),
          apiFetch("/api/contact/"),
          apiFetch("/api/social/")
        ]);

        if (resSettings.ok) {
          const s = await resSettings.json();
          const titleVal = (s.title === "My Portfolio" || !s.title) ? "Chandrabhan Yadav" : s.title;
          const heroTitleVal = (s.heroTitle === "My Portfolio" || !s.heroTitle) ? "Chandrabhan Yadav" : s.heroTitle;
          const subtitleVal = (s.heroSubtitle === "I build amazing products." || s.heroSubtitle === "AI Engineer & Full Stack Developer" || s.heroSubtitle === "AI Engineer | Full Stack Developer" || !s.heroSubtitle) ? defaultSettings.heroSubtitle : s.heroSubtitle;
          const imgVal = (s.heroImageUrl === "/images/default-hero.png" || !s.heroImageUrl) ? "/images/chandrabhan-hero.png" : s.heroImageUrl;
          
          setSettings({
            title: titleVal,
            description: s.description || defaultSettings.description,
            logoUrl: s.logoUrl || undefined,
            heroTitle: heroTitleVal,
            heroSubtitle: subtitleVal,
            heroImageUrl: imgVal,
            themePrimaryColor: s.themePrimaryColor
          });
        } else {
          setSettings(defaultSettings);
        }

        if (resAbout.ok) {
          const ab = await resAbout.json();
          setAbout(!ab.biography ? defaultAbout : ab);
        } else {
          setAbout(defaultAbout);
        }

        if (resEducation.ok) {
          const edu = await resEducation.json();
          setEducation(edu.length > 0 ? edu : defaultEducation);
        } else {
          setEducation(defaultEducation);
        }

        if (resExperience.ok) {
          const exp = await resExperience.json();
          setExperience(exp.length > 0 ? exp : defaultExperience);
        } else {
          setExperience(defaultExperience);
        }

        if (resProjects.ok) {
          const proj = await resProjects.json();
          setProjects(proj.length > 0 ? proj : defaultProjects);
        } else {
          setProjects(defaultProjects);
        }

        if (resAchievements.ok) {
          const ach = await resAchievements.json();
          setAchievements(ach.length > 0 ? ach : defaultAchievements);
        } else {
          setAchievements(defaultAchievements);
        }

        if (resResumes.ok) setResumes(await resResumes.json());

        if (resBlogs.ok) {
          const allBlogs: BlogPost[] = await resBlogs.json();
          const pub = allBlogs.filter((b) => b.is_published);
          setBlogs(pub.length > 0 ? pub : defaultBlogs);
        } else {
          setBlogs(defaultBlogs);
        }

        if (resContact.ok) {
          const c = await resContact.json();
          setContact(!c.email && !c.phone ? defaultContact : c);
        } else {
          setContact(defaultContact);
        }

        if (resSocials.ok) {
          const soc = await resSocials.json();
          setSocials(!soc.github && !soc.linkedin ? defaultSocials : soc);
        } else {
          setSocials(defaultSocials);
        }
      } catch (err) {
        console.error("Failed to load portfolio details", err);
        setSettings(defaultSettings);
        setAbout(defaultAbout);
        setEducation(defaultEducation);
        setExperience(defaultExperience);
        setProjects(defaultProjects);
        setAchievements(defaultAchievements);
        setBlogs(defaultBlogs);
        setContact(defaultContact);
        setSocials(defaultSocials);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const activeResume = resumes.find(r => r.is_active);

  const formatImage = (path?: string) => {
    if (!path) return "/placeholder.jpg";
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `http://localhost:8000${path}`;
  };

  const triggerChat = () => {
    window.dispatchEvent(new Event("open-chatbot"));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground antialiased transition-colors duration-300">
      
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm tracking-tight hover:opacity-80">
            {settings?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={formatImage(settings.logoUrl)} alt="logo" className="h-6 w-auto rounded-md" />
            ) : (
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-black uppercase">
                {settings?.title?.charAt(0) || "C"}
              </span>
            )}
            <span>{settings?.title || "Chandrabhan Yadav"}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <a href="#projects" className={`transition-colors hover:text-foreground ${activeSection === "projects" ? "text-primary" : ""}`}>Projects</a>
            <a href="#experience" className={`transition-colors hover:text-foreground ${activeSection === "experience" ? "text-primary" : ""}`}>Experience</a>
            <a href="#skills" className={`transition-colors hover:text-foreground ${activeSection === "skills" ? "text-primary" : ""}`}>Skills</a>
            <a href="#about" className={`transition-colors hover:text-foreground ${activeSection === "about" ? "text-primary" : ""}`}>About</a>
            <a href="#education" className={`transition-colors hover:text-foreground ${activeSection === "education" ? "text-primary" : ""}`}>Education</a>
            <a href="#achievements" className={`transition-colors hover:text-foreground ${activeSection === "achievements" ? "text-primary" : ""}`}>Awards</a>
            {blogs.length > 0 && (
              <a href="#blog" className={`transition-colors hover:text-foreground ${activeSection === "blog" ? "text-primary" : ""}`}>Articles</a>
            )}
            <a href="#contact" className={`transition-colors hover:text-foreground ${activeSection === "contact" ? "text-primary" : ""}`}>Contact</a>
            
            <button 
              onClick={triggerChat}
              className="flex items-center gap-1 text-primary hover:text-primary/80 font-extrabold uppercase tracking-wider text-xs border border-primary/20 px-2.5 py-1 rounded-lg bg-primary/10 transition-colors"
            >
              <MessageSquare className="h-3 w-3" /> AI Assistant
            </button>

            {activeResume && (
              <a 
                href={formatImage(activeResume.file_url)} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm"
              >
                <Download className="h-3 w-3" /> Resume
              </a>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1 text-foreground">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur-md flex flex-col p-6 gap-5 text-sm font-bold uppercase tracking-wider text-muted-foreground animate-in fade-in duration-200">
          <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
          <a href="#experience" onClick={() => setMobileMenuOpen(false)}>Experience</a>
          <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#education" onClick={() => setMobileMenuOpen(false)}>Education</a>
          <a href="#achievements" onClick={() => setMobileMenuOpen(false)}>Achievements</a>
          {blogs.length > 0 && <a href="#blog" onClick={() => setMobileMenuOpen(false)}>Blog</a>}
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              triggerChat();
            }}
            className="flex items-center gap-1.5 text-cyan-600 font-extrabold"
          >
            <MessageSquare className="h-4 w-4" /> AI Assistant
          </button>
          {activeResume && (
            <a 
              href={formatImage(activeResume.file_url)} 
              target="_blank" 
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold"
            >
              <Download className="h-4 w-4" /> Resume
            </a>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 bg-background border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-foreground">
              {settings?.title || "Chandrabhan Yadav"}
            </h1>
            
            <h2 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
              AI Engineer | Full Stack Developer
            </h2>

            <div className="space-y-4">
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl font-medium">
                Specialized in Agentic AI, RAG Systems, FastAPI, Next.js and Enterprise Chatbots.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl font-medium">
                Building AI-powered applications, automation systems and production-grade web platforms.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3.5 pt-2">
              <a 
                href="#projects" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <FolderGit2 className="h-4 w-4" /> View Projects
              </a>
              <a 
                href={activeResume ? formatImage(activeResume.file_url) : "#"}
                target="_blank"
                rel="noreferrer"
                className="border border-input hover:bg-accent hover:text-accent-foreground px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-foreground shadow-sm flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Download Resume
              </a>
              <button 
                onClick={triggerChat}
                className="border border-primary/20 bg-primary/5 hover:bg-primary/10 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-primary flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="h-4 w-4 text-primary" /> Ask AI Assistant
              </button>
            </div>

            {/* Circular Social Links under buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              {socials?.github && (
                <a 
                  href={socials.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-primary transition-colors shadow-sm"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
              )}
              {socials?.linkedin && (
                <a 
                  href={socials.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-primary transition-colors shadow-sm"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                </a>
              )}
              {socials?.twitter && (
                <a 
                  href={socials.twitter} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-primary transition-colors shadow-sm"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                </a>
              )}
              {socials?.instagram && (
                <a 
                  href={socials.instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-primary transition-colors shadow-sm"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              {contact?.email && (
                <a 
                  href={`mailto:${contact.email}`} 
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-primary transition-colors shadow-sm"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Profile Image & SaaS Metrics Grid */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative flex flex-col lg:block items-center">
              {/* Profile Image container */}
              {settings?.heroImageUrl && (
                <div className="w-[280px] h-[280px] md:w-[340px] md:h-[340px] relative rounded-3xl overflow-hidden border border-border shadow-xl bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formatImage(settings.heroImageUrl)}
                    alt="Chandrabhan Yadav"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Stats Container (Responsive Flow on Mobile, Floating on Desktop) */}
              <div className="flex flex-row lg:block gap-4 mt-6 lg:mt-0 justify-center">
                {/* Floating Stat Card 1 */}
                <div className="lg:absolute lg:-top-4 lg:-left-6 z-10 bg-card border border-border px-4 py-2.5 rounded-2xl shadow-lg flex flex-col items-center">
                  <span className="text-2xl font-black text-primary">8+</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Projects</span>
                </div>

                {/* Floating Stat Card 2 */}
                <div className="lg:absolute lg:bottom-6 lg:-right-6 z-10 bg-card border border-border px-4 py-2.5 rounded-2xl shadow-lg flex flex-col items-center">
                  <span className="text-2xl font-black text-primary">1+</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Year Exp</span>
                </div>

                {/* Floating Stat Card 3 */}
                <div className="lg:absolute lg:bottom-10 lg:-left-10 z-10 bg-card border border-border px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Open To Work</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 border-b border-border/40 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-xs uppercase font-extrabold text-primary tracking-widest flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" /> Featured Works
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-foreground">
                Enterprise Projects
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((item) => (
              <div 
                key={item._id} 
                className="group rounded-3xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                {item.screenshots && item.screenshots.length > 0 ? (
                  <div className="w-full relative overflow-hidden bg-muted border-b border-border aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={formatImage(item.screenshots[0])} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground">
                    <FolderGit2 className="h-12 w-12" />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-3 text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech Stack badges */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {item.tech_stack.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-muted border border-border text-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                      {item.github_url && (
                        <a href={item.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                          GitHub
                        </a>
                      )}
                      {item.live_url && (
                        <a href={item.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                          <Globe className="h-4 w-4" /> Live Demo
                        </a>
                      )}
                      <button onClick={triggerChat} className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 ml-auto transition-colors">
                        Case Study <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 border-b border-border/40 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-xs uppercase font-extrabold text-primary tracking-widest flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" /> Career Milestones
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-foreground">
                Work Experience
              </h2>
            </div>
          </div>

          <div className="space-y-8">
            {experience.map((item) => (
              <div 
                key={item._id} 
                className="group border border-border bg-card p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col gap-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{item.position}</h3>
                    <p className="text-base font-bold text-primary mt-0.5">{item.company}</p>
                  </div>
                  <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-muted border border-border text-foreground mt-2 md:mt-0">
                    {item.duration}
                  </span>
                </div>

                {/* Achievements List */}
                <div className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">
                  {item.responsibilities}
                </div>

                {/* Impact Metrics Mockup Integration */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                  <div className="p-3 bg-muted/50 border border-border rounded-2xl">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Query Latency</span>
                    <span className="text-sm font-extrabold text-primary mt-0.5 block">-40% Response</span>
                  </div>
                  <div className="p-3 bg-muted/50 border border-border rounded-2xl">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Traffic Load</span>
                    <span className="text-sm font-extrabold text-primary mt-0.5 block">10k+ Requests/Day</span>
                  </div>
                  <div className="p-3 bg-muted/50 border border-border rounded-2xl col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">AI Framework</span>
                    <span className="text-sm font-extrabold text-primary mt-0.5 block">Gemini / LangChain</span>
                  </div>
                </div>

                {/* Letters/Documents */}
                {(item.offer_letter || item.experience_letter) && (
                  <div className="flex flex-wrap gap-2.5 pt-4">
                    {item.offer_letter && (
                      <a href={formatImage(item.offer_letter)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary border border-border rounded-xl px-3 py-2 bg-muted/50 transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" /> Offer Letter
                      </a>
                    )}
                    {item.experience_letter && (
                      <a href={formatImage(item.experience_letter)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary border border-border rounded-xl px-3 py-2 bg-muted/50 transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" /> Experience Letter
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorized Skills Section */}
      <section id="skills" className="py-24 border-b border-border/40 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-extrabold text-primary tracking-widest flex items-center justify-center gap-1.5">
              <Terminal className="h-3.5 w-3.5" /> Skills Matrix
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-foreground">
              Technical Stack Matrix
            </h2>
          </div>

          <div className="space-y-8">
            {skillCategories.map((cat, cIdx) => (
              <div key={cIdx} className="bg-card border border-border p-6 rounded-3xl shadow-sm">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-4">{cat.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="px-3 py-1.5 rounded-xl bg-muted border border-border text-xs font-bold text-foreground flex items-center gap-1.5 hover:border-primary/50 hover:bg-primary/10 transition-colors cursor-default"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 border-b border-border/40 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-xs uppercase font-extrabold text-primary tracking-widest flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> Professional Bio
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-foreground">
                {about?.title || "Executive Profile"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Image Gallery (Only render if images exist) */}
            {about?.images && about.images.length > 0 && (
              <div className="lg:col-span-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {about.images.map((imgUrl, i) => (
                    <div key={i} className={`rounded-3xl overflow-hidden shadow-lg border border-border bg-muted aspect-square ${i === 0 ? 'col-span-2 aspect-video' : ''}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={formatImage(imgUrl)} 
                        alt="Profile snapshot" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Right details */}
            <div className={`${about?.images && about.images.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12 lg:max-w-4xl mx-auto w-full'} flex flex-col gap-6`}>
              <div className="p-8 rounded-3xl border border-border bg-card shadow-sm">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3">Biography</h3>
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  I am a passionate software developer specializing in building enterprise-grade web applications and AI platforms. With a strong foundation in modern frontend technologies and robust backend architectures, I focus on creating scalable, high-performance, and user-centric solutions. My approach combines technical excellence with Stripe-level design polish.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/50 border border-border p-5 rounded-2xl shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Core Focus</span>
                  <p className="text-sm font-bold text-foreground mt-1">Autonomous workflows & LangChain pipelines</p>
                </div>
                <div className="bg-muted/50 border border-border p-5 rounded-2xl shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Design Identity</span>
                  <p className="text-sm font-bold text-foreground mt-1">Stripe level polish & Notion clarity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-24 border-b border-border/40 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-xs uppercase font-extrabold text-primary tracking-widest flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" /> Qualifications
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-foreground">
                Education
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education.map((item) => (
              <div 
                key={item._id} 
                className="group border border-border bg-card p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  {item.images && item.images.length > 0 && (
                    <div className="h-40 w-full relative rounded-2xl overflow-hidden mb-4 bg-muted border border-border/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formatImage(item.images[0])} alt="Campus View" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-muted border border-border text-foreground">
                    {item.start_date} {item.end_date ? ` - ${item.end_date}` : ""}
                  </span>

                  <h3 className="text-xl font-bold mt-4 text-foreground">{item.degree}</h3>
                  <p className="text-sm font-semibold text-primary mt-1">{item.institute_name}</p>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.certificates && item.certificates.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-border/50 flex flex-wrap gap-2">
                    {item.certificates.map((cert, cIdx) => (
                      <button 
                        key={cIdx} 
                        onClick={() => setSelectedCertificate(formatImage(cert))}
                        className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> View Certificate
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-24 border-b border-border/40 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-xs uppercase font-extrabold text-primary tracking-widest flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" /> Accolades
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-foreground">
                Achievements & Certifications
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((item) => (
              <div 
                key={item._id} 
                className="group border border-border bg-card p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4 items-start">
                  {item.certificates && item.certificates.length > 0 ? (
                    <div 
                      onClick={() => setSelectedCertificate(formatImage(item.certificates[0]))}
                      className="h-20 w-20 relative rounded-xl overflow-hidden flex-shrink-0 bg-muted border border-border cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formatImage(item.certificates[0])} alt="achievement preview" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  ) : (
                    <div className="h-20 w-20 bg-muted border border-border rounded-xl flex-shrink-0 flex items-center justify-center text-primary">
                      <Award className="h-8 w-8" />
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-lg text-foreground leading-tight">{item.title}</h3>
                    <p className="text-[10px] text-muted-foreground font-extrabold uppercase mt-1 tracking-wider">{item.issuer} &bull; {item.date}</p>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {item.certificates && item.certificates.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50 flex justify-end">
                    <button 
                      onClick={() => setSelectedCertificate(formatImage(item.certificates[0]))}
                      className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                    >
                      Certificate Preview <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      {blogs.length > 0 && (
        <section id="blog" className="py-24 border-b border-border/40 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="text-xs uppercase font-extrabold text-primary tracking-widest flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Publications
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-foreground">
                  Technical Articles
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((item) => (
                <div 
                  key={item._id} 
                  className="group rounded-3xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {item.cover_image && (
                    <div className="h-48 w-full relative overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formatImage(item.cover_image)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Metadata */}
                      <div className="flex items-center gap-3 text-[10px] font-extrabold text-muted-foreground mb-3 uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-primary" /> {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> 5 Min Read</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.categories.map((cat, i) => (
                          <span key={i} className="text-[9px] font-extrabold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>

                      <h3 className="font-bold text-xl mb-3 line-clamp-2 hover:text-primary transition-colors text-foreground">
                        <Link href={`/blog/${item._id}`}>{item.title}</Link>
                      </h3>

                      <p className="text-xs text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                        {item.excerpt || item.content.slice(0, 110) + "..."}
                      </p>
                    </div>

                    <Link href={`/blog/${item._id}`} className="text-xs font-extrabold text-primary flex items-center gap-0.5 mt-auto hover:translate-x-1 transition-transform">
                      Read Full Article <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-extrabold text-primary tracking-widest flex items-center justify-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Contact Integration
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-foreground">
              Get In Touch
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            
            {/* Left: Contact Form */}
            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-6 text-foreground">Send an Inquiry</h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 text-muted-foreground">Name</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    placeholder="Jane Doe" 
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 text-muted-foreground">Email Address</label>
                  <input 
                    type="email" 
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    placeholder="jane@company.com" 
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 text-muted-foreground">Message</label>
                  <textarea 
                    rows={4}
                    value={formMsg}
                    onChange={(e) => setFormMsg(e.target.value)}
                    required
                    placeholder="Discuss project requirements..." 
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-bold text-sm shadow-sm transition-all hover:-translate-y-0.5"
                >
                  Send Inquiry
                </button>

                {formStatus === "success" && (
                  <p className="text-xs text-emerald-500 font-bold text-center mt-2">Message sent successfully! I will reach out shortly.</p>
                )}
                {formStatus === "error" && (
                  <p className="text-xs text-destructive font-bold text-center mt-2">Please complete all fields.</p>
                )}
              </form>
            </div>

            {/* Right: Social & Scheduling details */}
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-foreground">Direct Channels</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Have a direct opportunity? Schedule a call or contact me via details below.
                </p>

                <div className="flex flex-col gap-4">
                  {contact?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{contact.email}</span>
                    </div>
                  )}
                  {contact?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{contact.phone}</span>
                    </div>
                  )}
                  {contact?.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{contact.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Call-to-actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="https://wa.me/"
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 border border-input bg-card hover:bg-accent hover:text-accent-foreground px-4 py-3 rounded-2xl text-xs font-bold shadow-sm transition-colors text-foreground"
                >
                  WhatsApp Quick Chat
                </a>
                <button 
                  onClick={triggerChat}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-2xl text-xs font-bold shadow transition-colors"
                >
                  Ask AI Assistant to Schedule
                </button>
              </div>

              {socials && (
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-4">Social Profiles</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {socials.github && (
                      <a href={socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-border bg-card px-3.5 py-2 rounded-2xl hover:border-primary transition-colors text-xs font-bold text-foreground">
                        <svg className="h-4 w-4 text-foreground" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                        GitHub
                      </a>
                    )}
                    {socials.linkedin && (
                      <a href={socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-border bg-card px-3.5 py-2 rounded-2xl hover:border-primary transition-colors text-xs font-bold text-foreground">
                        <svg className="h-4 w-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                        LinkedIn
                      </a>
                    )}
                    {socials.twitter && (
                      <a href={socials.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-border bg-card px-3.5 py-2 rounded-2xl hover:border-primary transition-colors text-xs font-bold text-foreground">
                        <svg className="h-4 w-4 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                        Twitter
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background text-center text-xs text-muted-foreground font-semibold tracking-wider uppercase">
        <p>&copy; {new Date().getFullYear()} Chandrabhan Yadav. Personal Portfolio Platform.</p>
      </footer>

      {/* Floating Chatbot */}
      <Chatbot />

      {/* Interactive Certificate Modal Overlay */}
      {selectedCertificate && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedCertificate(null)}
        >
          <div className="relative bg-card border border-border p-2 rounded-3xl shadow-2xl max-w-3xl max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-background/80 text-foreground hover:bg-muted transition-colors border border-border"
            >
              <X className="h-5 w-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={selectedCertificate} 
              alt="Certificate Detail" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl bg-muted" 
            />
          </div>
        </div>
      )}

    </div>
  );
}
