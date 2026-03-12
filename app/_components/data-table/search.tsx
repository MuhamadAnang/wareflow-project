"use client";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useCallback } from "react";
import { Button } from "../ui/button";

interface ISearchProps {
  search: string;
  placeholderSearch?: string;
  onSearchChange?: (search: string) => void;
}

export const Search = ({ search, placeholderSearch, onSearchChange }: ISearchProps) => {
  const [inputValue, setInputValue] = useState(search);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onSearchChange?.(newValue);
    },
    [onSearchChange],
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    onSearchChange?.("");
  }, [onSearchChange]);

  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-8 pr-8"
        size={"sm"}
        placeholder={placeholderSearch || "Search..."}
        value={inputValue}
        onChange={handleInputChange}
      />
      {inputValue && (
        <Button
          type="button"
          size={"icon"}
          onClick={handleClear}
          variant={"ghost"}
          className="absolute right-0 top-1/2 -translate-y-1/2 hover:bg-transparent"
        >
          <X className="h-2 w-2" />
        </Button>
      )}
    </div>
  );
};
