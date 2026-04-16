import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface GenerateOptions {
  functionName: string;
}

export function useGenerate<T = string>({ functionName }: GenerateOptions) {
  const [result, setResult] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<{ prompt: string; result: T; timestamp: Date }[]>([]);

  const generate = async (body: Record<string, unknown>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke(functionName, { body });
      if (error) throw error;
      
      const generated = data?.result ?? data;
      setResult(generated);
      setHistory((prev) => [
        { prompt: String(body.prompt || body.message || ""), result: generated, timestamp: new Date() },
        ...prev.slice(0, 19),
      ]);
      return generated;
    } catch (err: any) {
      toast({
        title: "Generation failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { result, isLoading, history, generate, setResult };
}
