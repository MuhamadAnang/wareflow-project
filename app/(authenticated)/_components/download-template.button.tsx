"use client";

import { Button } from "@/app/_components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

const DownloadTemplateButton = () => {
  return (
    <Button
      variant={"outline"}
      size="sm"
      className="bg-transparent"
      onClick={() => {
        toast.info("This feature is coming soon!", { duration: 2000 });
      }}
    >
      <Download className="w-4 h-4 mr-2" />
      Download Template
    </Button>
  );
};

export default DownloadTemplateButton;
