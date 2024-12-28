"use client";

// Remix and React
import { useRouter } from "next/navigation";
import { FormEvent, useTransition } from "react";

// Third-party imports
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchBarProps {
  defaultQuery: string;
}

export default function SearchBar({ defaultQuery }: SearchBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = formData.get("q") as string;

    // Start a transition to update the URL with the search query
    // This is used to prevent the page from being reloaded
    // The transition will be reverted if the user navigates away from the page
    startTransition(() => {
      const params = new URLSearchParams();
      if (value) {
        params.set("q", value);
      }
      router.push(`/notes${value ? `?${params.toString()}` : ""}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        name="q"
        placeholder="Search notes..."
        className={cn(
          "pl-9 transition-all duration-200",
          isPending && "opacity-50",
          "focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background"
        )}
        defaultValue={defaultQuery}
        disabled={isPending}
      />
    </form>
  );
}
