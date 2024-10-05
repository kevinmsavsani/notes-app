import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelectCombobox } from "@/components/multicombobox-shadcn";
import { Filter } from "./note-app";

type FilterSectionProps = {
  filters: Partial<Filter>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilters: Partial<Filter>;
  setSelectedFilters: (filters: Partial<Filter>) => void;
};

export function FilterSection({
  filters,
  searchTerm,
  setSearchTerm,
  selectedFilters,
  setSelectedFilters,
}: FilterSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div>
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search notes or tags"
        />
      </div>
      {Object.entries(filters).map(([type, options]) => (
        <div key={type}>
          <Label htmlFor={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Label>
          <MultiSelectCombobox
            options={options.map((option) => ({ name: option, id: option }))}
            onSelect={(selectedOptions) => {
              const selectedValues = selectedOptions.map(
                (option) => option.name
              );
              setSelectedFilters((prev) => ({
                ...prev,
                [type]: selectedValues,
              }));
            }}
            placeholder={`Filter by ${type}`}
            selectedValues={selectedFilters[type] || []}
            size="md"
          />
        </div>
      ))}
    </div>
  );
}