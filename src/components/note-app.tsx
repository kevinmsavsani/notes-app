"use client";

import { useState } from "react";
import { NoteForm } from "./note-form";
import { NoteList } from "./note-list";
import { FilterManager } from "./filter-manager";
import notesData from "../assets/notes.json";
export type Filter = {
  region: string[];
  rating: string[];
  brand: string[];
  category: string[];
  section: string[];
};

export type Note = {
  id: number;
  description: string;
  tags: string[];
  filters: unknown;
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const NoteApp = () => {
  const [notes, setNotes] = useState<Note[]>(notesData);
  const [filters, setFilters] = useState<Filter>({
    region: ["North", "South", "East", "West"],
    rating: ["1", "2", "3", "4", "5"],
    brand: ["La Trattoria"],
    category: ["Cafe", "Restaurant", "Shopping"],
    section: ["Clothing"],
  });
  const [activeTab, setActiveTab] = useState("filters-form");

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const addNote = (note: Omit<Note, 'id'>) => {
    setNotes([...notes, { ...note, id: Date.now() }])
  }

  const addFilter = (type: keyof Filter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: [...prev[type], value]
    }))
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex flex-col items-center p-2">
        <TabsList>
          <TabsTrigger value="filters-form">Filters & Form</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="filters-form">
          <div className="">
            <FilterManager filters={filters} addFilter={addFilter} />
            <NoteForm addNote={addNote} filters={filters} />
          </div>
        </TabsContent>
        <TabsContent value="notes">
          <div className="">
            <NoteList notes={notes} filters={filters} addNote={addNote} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NoteApp;
