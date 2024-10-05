"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Note, Filter } from "./note-app";
import {
  ChevronDownCircle,
  ChevronUpCircle,
  Circle,
  List,
  Minus,
  Plus,
  Square,
} from "lucide-react";
import { MultiSelectCombobox } from "@/components/multicombobox-shadcn";

type NoteListProps = {
  notes: Note[];
  filters: Filter;
};

export function NoteList({ notes, filters }: NoteListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Partial<Filter>>({});
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFilters = Object.entries(selectedFilters).every(
        ([key, value]) =>
          !value || value.includes(note.filters[key as keyof Filter])
      );

      return matchesSearch && matchesFilters;
    });
  }, [notes, searchTerm, selectedFilters]);

  const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      const keyValue = key
        .split(".")
        .reduce((acc, part) => acc && acc[part], currentValue);
      (result[keyValue] = result[keyValue] || []).push(currentValue);
      return result;
    }, {});
  };

  const groupedByRegion = groupBy(filteredNotes, "filters.region");

  // Generate initial openGroups state with all keys set to true
  useEffect(() => {
    const initialOpenGroups = {};
    Object.keys(groupedByRegion).forEach((region) => {
      initialOpenGroups[`region-${region}`] = true;
      const groupedByRating = groupBy(
        groupedByRegion[region],
        "filters.rating"
      );
      Object.keys(groupedByRating).forEach((rating) => {
        initialOpenGroups[`region-${region}-rating-${rating}`] = true;
        const groupedByBrand = groupBy(
          groupedByRating[rating],
          "filters.brand"
        );
        Object.keys(groupedByBrand).forEach((brand) => {
          initialOpenGroups[
            `region-${region}-rating-${rating}-brand-${brand}`
          ] = true;
          const groupedByCategory = groupBy(
            groupedByBrand[brand],
            "filters.category"
          );
          Object.keys(groupedByCategory).forEach((category) => {
            initialOpenGroups[
              `region-${region}-rating-${rating}-brand-${brand}-category-${category}`
            ] = true;
            const groupedBySection = groupBy(
              groupedByCategory[category],
              "filters.section"
            );
            Object.keys(groupedBySection).forEach((section) => {
              initialOpenGroups[
                `region-${region}-rating-${rating}-brand-${brand}-category-${category}-section-${section}`
              ] = true;
            });
          });
        });
      });
    });
    setOpenGroups(initialOpenGroups);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Notes</h2>
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
              selectedValues={selectedFilters[type] || []} // Pass the selected values
              size="md" // Adjust size as needed
            />
          </div>
        ))}
      </div>
      {Object.entries(groupedByRegion).map(([region, regionNotes]) => {
        const groupedByRating = groupBy(regionNotes, "filters.rating");
        const regionKey = `region-${region}`;
        return (
          <div key={region} className="p-2 text-sm">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => toggleGroup(regionKey)}
            >
              {openGroups[regionKey] ? (
                <Minus className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              <h3 className="text-lg font-semibold">{region}</h3>
            </div>
            {openGroups[regionKey] &&
              Object.entries(groupedByRating).map(([rating, ratingNotes]) => {
                const groupedByBrand = groupBy(ratingNotes, "filters.brand");
                const ratingKey = `${regionKey}-rating-${rating}`;
                return (
                  <div key={rating} className="pl-4">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => toggleGroup(ratingKey)}
                    >
                      {openGroups[ratingKey] ? (
                        <Circle className="mr-2 h-4 w-4" />
                      ) : (
                        <Circle className="mr-2 h-4 w-4" />
                      )}
                      <h4 className="text-md font-semibold">{rating}</h4>
                    </div>
                    {openGroups[ratingKey] &&
                      Object.entries(groupedByBrand).map(
                        ([brand, brandNotes]) => {
                          const groupedByCategory = groupBy(
                            brandNotes,
                            "filters.category"
                          );
                          const brandKey = `${ratingKey}-brand-${brand}`;
                          return (
                            <div key={brand} className="pl-4">
                              <div
                                className="flex items-center cursor-pointer"
                                onClick={() => toggleGroup(brandKey)}
                              >
                                {openGroups[brandKey] ? (
                                  <Square className="mr-2 h-4 w-4" />
                                ) : (
                                  <Square className="mr-2 h-4 w-4" />
                                )}
                                <h5 className="text-md font-semibold">
                                  {brand}
                                </h5>
                              </div>
                              {openGroups[brandKey] &&
                                Object.entries(groupedByCategory).map(
                                  ([category, categoryNotes]) => {
                                    const groupedBySection = groupBy(
                                      categoryNotes,
                                      "filters.section"
                                    );
                                    const categoryKey = `${brandKey}-category-${category}`;
                                    return (
                                      <div key={category} className="pl-4">
                                        <div
                                          className="flex items-center cursor-pointer"
                                          onClick={() =>
                                            toggleGroup(categoryKey)
                                          }
                                        >
                                          {openGroups[categoryKey] ? (
                                            <ChevronDownCircle className="mr-2 h-4 w-4" />
                                          ) : (
                                            <ChevronUpCircle className="mr-2 h-4 w-4" />
                                          )}
                                          <h6 className="text-md font-semibold">
                                            {category}
                                          </h6>
                                        </div>
                                        {openGroups[categoryKey] &&
                                          Object.entries(groupedBySection).map(
                                            ([section, sectionNotes]) => {
                                              const sectionKey = `${categoryKey}-section-${section}`;
                                              return (
                                                <div
                                                  key={section}
                                                  className="pl-4"
                                                >
                                                  <div
                                                    className="flex items-center cursor-pointer"
                                                    onClick={() =>
                                                      toggleGroup(sectionKey)
                                                    }
                                                  >
                                                    {openGroups[sectionKey] ? (
                                                      <List className="mr-2 h-4 w-4" />
                                                    ) : (
                                                      <List className="mr-2 h-4 w-4" />
                                                    )}
                                                    <h6 className="text-md font-semibold">
                                                      {section}
                                                    </h6>
                                                  </div>
                                                  {openGroups[sectionKey] && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                      {sectionNotes.map(
                                                        (note) => (
                                                          <Card key={note.id}>
                                                            <CardContent className="p-2">
                                                              <p>
                                                                {
                                                                  note.description
                                                                }
                                                              </p>
                                                              <div>
                                                                {note.tags.map(
                                                                  (tag) => (
                                                                    <Badge
                                                                      key={tag}
                                                                      variant="secondary"
                                                                      className="mr-1"
                                                                    >
                                                                      {tag}
                                                                    </Badge>
                                                                  )
                                                                )}
                                                              </div>
                                                            </CardContent>
                                                          </Card>
                                                        )
                                                      )}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            }
                                          )}
                                      </div>
                                    );
                                  }
                                )}
                            </div>
                          );
                        }
                      )}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}
