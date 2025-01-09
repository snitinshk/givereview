import { useWidget } from "@/app/context/widget-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ADMIN_URL } from "@/constant";
import { useToast } from "@/hooks/use-toast";
import { getURL } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LuCopy } from "react-icons/lu";

const EmbedTabs = () => {
  const { toast } = useToast();
  const { widget } = useWidget();

  const [embedCode, setEmbedCode] = useState("");

  useEffect(() => {
    if (widget?.uuid) {
      setEmbedCode(`
        <div id="testimonial-widget-container"></div>
        <script src="${getURL()}testimonials-slider.js" data-widget="testimonials-slider" uuid="${
        widget?.uuid
      }">
        </script>
      `);
    }
  }, [widget?.uuid]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard!",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Failed to copy!",
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
        <Button
          variant="ghost"
          onClick={() => copyToClipboard(embedCode.trim())}
        >
          <LuCopy className="text-2xl" />
        </Button>
      </div>
    </>
  );
};

export default EmbedTabs;
