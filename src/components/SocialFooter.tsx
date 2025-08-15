import React from "react";
import { Github, MessageCircle } from "lucide-react";
import { AppService } from "@/config/appService";

const SocialFooter: React.FC = () => {
  return (
    <div className="flex justify-center items-center gap-4 py-4 border-t border-border mt-8">
      <a
        href={AppService.SOCIAL_LINKS.TELEGRAM}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm">Telegram</span>
      </a>
      <a
        href={AppService.SOCIAL_LINKS.GITHUB}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <Github className="w-5 h-5" />
        <span className="text-sm">GitHub</span>
      </a>
    </div>
  );
};

export default SocialFooter;
