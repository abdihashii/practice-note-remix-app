import type { Route } from "./+types";

export default function NotePage({ params }: Route.ComponentProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Note {params.id}</h2>
      <div className="p-4 rounded border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-300">
          This is the content for note {params.id}
        </p>
      </div>
    </div>
  );
}
