import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { LuCopy } from "react-icons/lu";

const EmbedTabs = () => {

  const { toast } = useToast();

  const [embedCode, setEmbedCode] = useState("");

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: "Copied to clipboard!",
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Error",
        description: "Failed to copy!",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <Textarea
          placeholder="Code here"
          className="h-28 resize-none"
          value={embedCode}
          onChange={(e) => setEmbedCode(e.target.value)}
        />
        <Button variant="ghost" onClick={() => copyToClipboard(embedCode)}>
          <LuCopy className="text-2xl" />
        </Button>
      </div>
    </>
  );
};

export default EmbedTabs;