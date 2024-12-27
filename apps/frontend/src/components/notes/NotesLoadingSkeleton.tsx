// Third-party imports
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function NotesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="flex h-full flex-col">
          <CardHeader>
            <Skeleton className="mb-2 h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="flex-grow">
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </CardContent>
          <CardFooter className="justify-end">
            <div className="flex w-full flex-col space-y-2 md:w-auto md:flex-row md:space-x-2 md:space-y-0">
              <Skeleton className="h-9 w-full md:w-20" />
              <Skeleton className="h-9 w-full md:w-20" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
