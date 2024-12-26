"use client";

// Remix and React
import { useRouter } from "next/navigation";
import { FormEvent, useTransition } from "react";

// Third-party imports
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
    <form onSubmit={handleSubmit} className="w-full max-w-xs">
      <Input
        type="search"
        name="q"
        placeholder="Search notes..."
        className={cn(isPending && "opacity-50")}
        defaultValue={defaultQuery}
        disabled={isPending}
      />
    </form>
  );
}
