import { useState } from "react";
import { motion } from "framer-motion";
import { Image, Loader2, Wand2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorCard } from "@/components/GeneratorCard";
import { useGenerate } from "@/hooks/useGenerate";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const { result, isLoading, history, generate } = useGenerate<string>({ functionName: "generate-image" });

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    generate({ prompt });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Image className="h-8 w-8 text-primary" />
          Image Generator
        </h1>
        <p className="text-muted-foreground mt-2">Create stunning AI-generated images from text prompts</p>
      </motion.div>

      <GeneratorCard title="Prompt">
        <Textarea
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px] bg-secondary border-border resize-none"
        />
        <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="mt-4 glow">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Generate Image
        </Button>
      </GeneratorCard>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Creating your image...</p>
          </div>
        </div>
      )}

      {result && (
        <GeneratorCard title="Generated Image">
          <div className="relative group">
            <img
              src={result}
              alt="AI generated"
              className="w-full rounded-lg"
            />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="secondary" size="sm" asChild>
                <a href={result} download="generated-image.png">
                  <Download className="h-4 w-4 mr-1" /> Download
                </a>
              </Button>
            </div>
          </div>
        </GeneratorCard>
      )}

      {history.length > 0 && (
        <GeneratorCard title="History">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-auto">
            {history.map((item, i) => (
              <div key={i} className="relative group">
                <img
                  src={String(item.result)}
                  alt={item.prompt}
                  className="w-full aspect-square object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-end p-2">
                  <p className="text-xs truncate">{item.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </GeneratorCard>
      )}
    </div>
  );
}
