import { cn } from "@/lib/utils";

export default function Spinner({ className }: { className?: string }) {
    return (
      <div className={cn("flex items-center justify-center h-screen", className)}>
        <div className="size-5 border-2 border-foreground border-t-transparent rounded-full animate-spin"/>
      </div>
    );
  }
  