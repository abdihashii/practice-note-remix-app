// Third party components
import { TextSearchIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const SearchBar = () => {
  return (
    <div className="w-full relative h-12">
      <TextSearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none transition-colors" />
      <Input
        type="text"
        placeholder="Search your notes"
        className="pl-10 w-full h-full peer pr-10"
      />
      <Button
        variant={"outline"}
        size="icon"
        className="absolute right-2.5 top-2.5 pointer-events-none h-7 w-7 text-gray-400 transition-colors"
      >
        /
      </Button>
    </div>
  );
};
