// Third-party imports
import { Card, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export function NotesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className={cn(
            "h-full transition-colors duration-200 ease-in-out",
            "group-hover:bg-secondary/50"
          )}
        >
          <CardHeader className="relative flex flex-row items-center justify-between space-x-0 space-y-0">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-40" /> {/* Title */}
              <Skeleton className="h-4 w-32" /> {/* Date */}
            </div>
            <div className="absolute right-2 top-2">
              <Skeleton className="h-4 w-4" /> {/* Star button */}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
