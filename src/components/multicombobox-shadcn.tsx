"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon, PlusIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
  name: string;
  id: number;
}

interface MultiSelectComboboxProps {
  options: Option[];
  onSelect: (selectedOptions: Option[]) => void;
  onAddOption?: (option: Option) => void;
  placeholder?: string;
  selectedValues?: string[]; // Changed to array of strings
  size?: "sm" | "md" | "lg"; // New size prop
}

export function MultiSelectCombobox({
  options,
  onSelect,
  onAddOption,
  placeholder = "Select options...",
  selectedValues = [], // Default to empty array
  size = "sm", // Default size
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState<Option[]>(
    options.filter((option) => selectedValues.includes(option.name)) // Initialize from selectedValues
  );
  const [filteredOptions, setFilteredOptions] =
    React.useState<Option[]>(options);
  const [inputName, setInputName] = React.useState("");

  // Size classes based on the size prop
  const sizeClasses = {
    sm: "w-[200px]",
    md: "w-[400px]",
    lg: "w-[600px]",
  };

  React.useEffect(() => {
    if (inputName) {
      const filtered = options.filter((option) =>
        option.name.toLowerCase().includes(inputName.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [inputName, options, selectedOptions]);

  const handleSelect = (selectedName: string) => {
    const selectedOption = options.find(
      (option) => option.name === selectedName
    );
    if (selectedOption) {
      if (selectedOptions.find((option) => option.name === selectedName)) {
        // If already selected, remove it
        const updatedSelections = selectedOptions.filter(
          (option) => option.name !== selectedName
        );
        setSelectedOptions(updatedSelections);
        onSelect(updatedSelections);
      } else {
        // If not selected, add it
        setSelectedOptions((prev) => [...prev, selectedOption]);
        onSelect([...selectedOptions, selectedOption]);
      }
    }
    setInputName("");
  };

  const handleAddOption = () => {
    if (onAddOption && inputName) {
      const newOption = { name: inputName.toLowerCase(), id: options.length };
      onAddOption(newOption);
      setSelectedOptions((prev) => [...prev, newOption]);
      setFilteredOptions([...filteredOptions, newOption]);
      setInputName("");
      setOpen(false);
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(sizeClasses[size], " justify-between")}
          >
            {selectedOptions.length > 0
              ? selectedOptions.map((option) => option.name).join(", ")
              : placeholder}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{ minWidth: "400px", maxWidth: "600px" }} // Dynamic width based on content
        >
          <Command>
            <CommandInput
              placeholder={`Search ${onAddOption ? "or add" : ""} option...`}
              value={inputName}
              onValueChange={setInputName}
              className="h-9"
            />
            <CommandList style={{ maxHeight: "200px", overflowY: "auto" }}>
              {filteredOptions.length > 0 ? (
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.name}
                      onSelect={() => handleSelect(option.name)}
                    >
                      {option.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedOptions.find(
                            (selected) => selected.name === option.name
                          )
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>No option found.</CommandEmpty>
              )}
            </CommandList>

            {filteredOptions.length === 0 && inputName && onAddOption && (
              <div className="p-2">
                <Button
                  variant="ghost"
                  onClick={handleAddOption}
                  className="w-full"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add "{inputName}"
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
