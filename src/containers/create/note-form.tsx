import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from '../note-app'

type NoteFormProps = {
  addNote: (note: { description: string, tags: string[], filters: Partial<Filter> }) => void
  filters: Filter
}

export function NoteForm({ addNote, filters }: NoteFormProps) {
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<Partial<Filter>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addNote({
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      filters: selectedFilters
    })
    setDescription('')
    setTags('')
    setSelectedFilters({})
  }

  const handleFilterChange = (type: keyof Filter, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter note description"
          required
          className="h-20"
        />
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(filters).map(([type, options]) => (
          <div key={type}>
            <Label htmlFor={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</Label>
            <Select onValueChange={(value) => handleFilterChange(type as keyof Filter, value)}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${type}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <Button type="submit" className="w-full">Add Note</Button>
    </form>
  )
}