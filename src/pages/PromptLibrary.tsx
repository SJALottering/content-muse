import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Copy, Check, Heart, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Prompt {
  id: string;
  text: string;
  category: string;
  isFavorite: boolean;
  isCustom?: boolean;
}

const defaultPrompts: Prompt[] = [
  { id: "1", text: "Write a compelling blog post about the future of AI in healthcare", category: "Writing", isFavorite: false },
  { id: "2", text: "Create an engaging Instagram caption for a sunset photo", category: "Writing", isFavorite: false },
  { id: "3", text: "Write a professional email requesting a meeting with a potential client", category: "Writing", isFavorite: false },
  { id: "4", text: "Build a responsive login form with email and password validation", category: "Coding", isFavorite: false },
  { id: "5", text: "Create a REST API endpoint with CRUD operations in Express.js", category: "Coding", isFavorite: false },
  { id: "6", text: "Write a Python script to scrape website data using BeautifulSoup", category: "Coding", isFavorite: false },
  { id: "7", text: "A futuristic cityscape at sunset with flying cars and neon lights", category: "Image", isFavorite: false },
  { id: "8", text: "Minimalist logo design for a tech startup, clean lines, blue tones", category: "Image", isFavorite: false },
  { id: "9", text: "Fantasy landscape with floating islands, waterfalls, and magical creatures", category: "Image", isFavorite: false },
];

const categories = ["All", "Writing", "Coding", "Image"];

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState<Prompt[]>(defaultPrompts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const [newCategory, setNewCategory] = useState("Writing");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = prompts.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.text.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const copyPrompt = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (id: string) => {
    setPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)));
  };

  const addPrompt = () => {
    if (!newPrompt.trim()) return;
    setPrompts((prev) => [
      { id: Date.now().toString(), text: newPrompt, category: newCategory, isFavorite: false, isCustom: true },
      ...prev,
    ]);
    setNewPrompt("");
    setShowAdd(false);
    toast({ title: "Prompt added!" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Prompt Library
        </h1>
        <p className="text-muted-foreground mt-2">Browse, save, and manage your AI prompts</p>
      </motion.div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <Button variant="outline" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="h-4 w-4 mr-1" /> Add Prompt
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "secondary"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-lg p-4 space-y-3"
          >
            <Textarea
              placeholder="Enter your custom prompt..."
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              className="bg-secondary border-border"
            />
            <div className="flex gap-2">
              {["Writing", "Coding", "Image"].map((c) => (
                <Button key={c} variant={newCategory === c ? "default" : "secondary"} size="sm" onClick={() => setNewCategory(c)}>
                  {c}
                </Button>
              ))}
            </div>
            <Button onClick={addPrompt} disabled={!newPrompt.trim()}>Save Prompt</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {filtered.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-lg p-4 flex items-start gap-3 group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm">{p.text}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{p.category}</span>
                {p.isCustom && <span className="text-xs text-muted-foreground">Custom</span>}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => toggleFavorite(p.id)}>
                <Heart className={`h-4 w-4 ${p.isFavorite ? "fill-destructive text-destructive" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => copyPrompt(p.id, p.text)}>
                {copiedId === p.id ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-10">No prompts found</p>
        )}
      </div>
    </div>
  );
}
