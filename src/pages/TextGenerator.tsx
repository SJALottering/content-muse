import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Type, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratorCard, CopyButton } from "@/components/GeneratorCard";
import { useGenerate } from "@/hooks/useGenerate";
import ReactMarkdown from "react-markdown";

const contentTypes = [
  { value: "blog", label: "Blog Post" },
  { value: "caption", label: "Social Media Caption" },
  { value: "essay", label: "Essay" },
  { value: "summary", label: "Summary" },
  { value: "email", label: "Email" },
];

export default function TextGenerator() {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("blog");
  const { result, isLoading, history, generate } = useGenerate<string>({ functionName: "generate-text" });

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    generate({ prompt, contentType });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-4"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
          <Type className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Text Generator
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Generate high-quality text content with AI
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GeneratorCard title="Input">
          <div className="flex flex-col items-center gap-4">
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger className="w-full sm:w-64 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Describe what you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[140px] bg-secondary border-border resize-none text-center sm:text-left"
            />
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              size="lg"
              className="glow w-full sm:w-auto px-8"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate
            </Button>
          </div>
        </GeneratorCard>
      </motion.div>

      {result && (
        <GeneratorCard title="Result">
          <div className="flex justify-end">
            <CopyButton text={result} />
          </div>
          <div className="prose prose-invert max-w-none text-foreground">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </GeneratorCard>
      )}

      {history.length > 0 && (
        <GeneratorCard title="History">
          <div className="space-y-3 max-h-60 overflow-auto">
            {history.map((item, i) => (
              <div key={i} className="flex items-start justify-between p-3 bg-secondary rounded-md">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground truncate">{item.prompt}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{item.timestamp.toLocaleTimeString()}</p>
                </div>
                <CopyButton text={String(item.result)} />
              </div>
            ))}
          </div>
        </GeneratorCard>
      )}
    </div>
  );
}
