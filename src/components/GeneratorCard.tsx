import { motion } from "framer-motion";
import { Copy, Check, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface GeneratorCardProps {
  title: string;
  children: React.ReactNode;
}

export function GeneratorCard({ title, children }: GeneratorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </motion.div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy}>
      {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

export function DownloadButton({ url, filename }: { url: string; filename: string }) {
  return (
    <Button variant="ghost" size="sm" asChild>
      <a href={url} download={filename}>
        <Download className="h-4 w-4" />
      </a>
    </Button>
  );
}
