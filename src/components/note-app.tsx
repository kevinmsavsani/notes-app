"use client"

import { useState } from 'react'
import { NoteForm } from './note-form'
import { NoteList } from './note-list'
import { FilterManager } from './filter-manager'
import notesData from '../assets/notes.json'
export type Filter = {
  region: string[]
  rating: string[]
  brand: string[]
  category: string[]
  section: string[]
}

export type Note = {
  id: number
  description: string
  tags: string[]
  filters: unknown
}

export default function NoteApp() {
  const [notes, setNotes] = useState<Note[]>(notesData)
  const [filters, setFilters] = useState<Filter>({
    region: ["North", "South", "East", "West"],
    rating: ["1", "2", "3", "4", "5"],
    brand: ["La Trattoria"],
    category: ["Cafe", "Restaurant", "Shopping"],
    section: ["Clothing"]
  })

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
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <FilterManager filters={filters} addFilter={addFilter} />
          <NoteForm addNote={addNote} filters={filters} />
        </div>
        <div className="lg:col-span-2">
          <NoteList notes={notes} filters={filters} />
        </div>
      </div>
    </div>
  )
}