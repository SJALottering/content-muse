import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratorCard, CopyButton } from "@/components/GeneratorCard";
import { useGenerate } from "@/hooks/useGenerate";

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "html", label: "HTML/CSS" },
  { value: "typescript", label: "TypeScript" },
  { value: "rust", label: "Rust" },
];

export default function CodeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("javascript");
  const { result, isLoading, history, generate } = useGenerate<string>({ functionName: "generate-code" });

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    generate({ prompt, language });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Code className="h-8 w-8 text-primary" />
          Code Generator
        </h1>
        <p className="text-muted-foreground mt-2">Generate code snippets in multiple programming languages</p>
      </motion.div>

      <GeneratorCard title="Input">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-48 bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((l) => (
              <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Describe what code you need..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] bg-secondary border-border resize-none mt-3"
        />
        <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="mt-4 glow">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Generate Code
        </Button>
      </GeneratorCard>

      {result && (
        <GeneratorCard title="Generated Code">
          <div className="flex justify-end">
            <CopyButton text={result} />
          </div>
          <pre className="bg-secondary rounded-md p-4 overflow-x-auto">
            <code className="text-sm font-mono text-foreground">{result}</code>
          </pre>
        </GeneratorCard>
      )}

      {history.length > 0 && (
        <GeneratorCard title="History">
          <div className="space-y-3 max-h-60 overflow-auto">
            {history.map((item, i) => (
              <div key={i} className="flex items-start justify-between p-3 bg-secondary rounded-md">
                <p className="text-sm text-muted-foreground truncate flex-1">{item.prompt}</p>
                <CopyButton text={String(item.result)} />
              </div>
            ))}
          </div>
        </GeneratorCard>
      )}
    </div>
  );
}
