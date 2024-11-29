import { StarIcon } from "lucide-react";
import { cn } from "~/lib/utils";

export const StarFilledIcon = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof StarIcon>) => {
  return (
    <StarIcon
      {...props}
      className={cn("fill-yellow-500 text-yellow-500", className)}
    />
  );
};
