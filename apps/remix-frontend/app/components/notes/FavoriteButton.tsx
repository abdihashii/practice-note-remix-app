// Third-party imports
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StarIcon } from "lucide-react";
import { toggleNoteFavorite } from "~/api/notes";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";

interface FavoriteButtonProps {
  noteId: string;
  isFavorite: boolean;
  size?: "sm" | "default";
  variant?: "ghost" | "outline" | "default";
}

export function FavoriteButton({
  noteId,
  isFavorite,
  size = "default",
  variant = "ghost",
}: FavoriteButtonProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const toggleFavoriteMutation = useMutation({
    mutationFn: toggleNoteFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["note", noteId],
      });

      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    },
  });

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent triggering card click in list view
    e.stopPropagation();
    toggleFavoriteMutation.mutate(noteId);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      className={cn(
        "group",
        toggleFavoriteMutation.isPending && "animate-pulse",
        size === "sm" && "h-8 w-8"
      )}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <StarIcon
        className={cn(
          "h-[1.2rem] w-[1.2rem] transition-colors",
          size === "sm" && "h-4 w-4",
          isFavorite && "fill-yellow-500 text-yellow-500",
          !isFavorite && "group-hover:fill-yellow-500/10"
        )}
      />
    </Button>
  );
}
