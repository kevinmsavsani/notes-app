import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from './note-app'

type FilterManagerProps = {
  filters: Filter
  addFilter: (type: keyof Filter, value: string) => void
}

export function FilterManager({ filters, addFilter }: FilterManagerProps) {
  const [selectedType, setSelectedType] = useState<keyof Filter>('region')
  const [newFilter, setNewFilter] = useState('')

  const handleAddFilter = () => {
    if (newFilter && !filters[selectedType].includes(newFilter)) {
      addFilter(selectedType, newFilter)
      setNewFilter('')
    }
  }

  return (
    <div className="space-y-4 mb-4">
      <h2 className="text-xl font-semibold">Manage Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <Label htmlFor="filter-type">Filter Type</Label>
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as keyof Filter)}>
            <SelectTrigger>
              <SelectValue placeholder="Select filter type" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(filters).map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="new-filter">New Filter</Label>
          <Input
            id="new-filter"
            value={newFilter}
            onChange={(e) => setNewFilter(e.target.value)}
            placeholder="Enter new filter"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleAddFilter} className="w-full">Add Filter</Button>
        </div>
      </div>
    </div>
  )
}