import { Skeleton } from "@/components/ui/skeleton";

export function SearchBarFallback() {
  return (
    <div className="flex h-12 items-center">
      <Skeleton className="h-10 w-[200px]" />
    </div>
  );
}
