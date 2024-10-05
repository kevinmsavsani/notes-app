import { useState, useMemo, useEffect } from "react";
import { FilterSection } from "./filter-section";
import GroupCard from "./group-card";
import { Note, Filter } from "./note-app";

type NoteListProps = {
  notes: Note[];
  addNote: (note: Omit<Note, "id">) => void;
};

export function NoteList({ notes, addNote }: NoteListProps) {
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
        ([key, values]) =>
          !values || values.includes(note.filters[key as keyof Filter])
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

  const deriveFilters = (notes) => {
    const filters: Partial<Filter> = {};
    notes.forEach((note) => {
      Object.entries(note.filters).forEach(([key, value]) => {
        if (!filters[key]) {
          filters[key] = new Set();
        }
        filters[key].add(value);
      });
    });
    return Object.fromEntries(
      Object.entries(filters).map(([key, valueSet]) => [
        key,
        Array.from(valueSet),
      ])
    );
  };

  const filters = useMemo(() => deriveFilters(notes), [notes]);

  const groupedByRegion = groupBy(filteredNotes, "filters.region");

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
      <h2 className="text-2xl font-bold">Notes</h2>
      <FilterSection
        filters={filters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      <GroupCard
        groupedNotes={groupedByRegion}
        toggleGroup={toggleGroup}
        openGroups={openGroups}
        groupBy={groupBy}
        addNote={addNote}
      />
    </div>
  );
}