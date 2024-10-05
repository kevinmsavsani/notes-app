import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { NoteCard } from "./note-card";
import { Note } from "./note-app";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type GroupCardProps = {
  groupedNotes: { [key: string]: Note[] };
  toggleGroup: (key: string) => void;
  openGroups: { [key: string]: boolean };
  groupBy: (array: Note[], key: string) => { [key: string]: Note[] };
  addNote: (note: Omit<Note, "id">) => void;
};

export default function GroupCard({
  groupedNotes,
  toggleGroup,
  openGroups,
  groupBy,
  addNote,
}: GroupCardProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteDescription, setNewNoteDescription] = useState("");
  const [newNoteTags, setNewNoteTags] = useState([""]);
  const [newFilters, setnewFilters] = useState({
    region: "",
    rating: "",
    brand: "",
    category: "",
    section: "",
  });
  const handleAddNoteToggle = () => {
    setIsAddingNote(!isAddingNote);
  };

  const handleNewNoteDescriptionChange = (e) => {
    setNewNoteDescription(e.target.value);
  };

  const handleNewNoteTagChange = (index, newTag) => {
    const newTags = [...newNoteTags];
    newTags[index] = newTag;
    setNewNoteTags(newTags);
  };

  const handleNewNoteTagAdd = () => {
    setNewNoteTags([...newNoteTags, ""]);
  };

  const handleNewNoteTagDelete = (index) => {
    const newTags = newNoteTags.filter((_, i) => i !== index);
    setNewNoteTags(newTags);
  };

  const handleSaveNewNote = () => {
    addNote({
      description: newNoteDescription,
      tags: newNoteTags,
      filters: newFilters,
    });
    setIsAddingNote(false);
  };
  return (
    <>
      {Object.entries(groupedNotes).map(([region, regionNotes]) => {
        const groupedByRating = groupBy(regionNotes, "filters.rating");
        const regionKey = `region-${region}`;
        return (
          <div key={region} className="p-2">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => toggleGroup(regionKey)}
            >
              {openGroups[regionKey] ? (
                <ChevronDown className="mr-2 h-5 w-5" />
              ) : (
                <ChevronRight className="mr-2 h-5 w-5" />
              )}
              <h3 className="text-xl font-semibold">{region}</h3>
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
                        <ChevronDown className="mr-2 h-4 w-4" />
                      ) : (
                        <ChevronRight className="mr-2 h-4 w-4" />
                      )}
                      <h4 className="text-lg font-semibold">{rating}</h4>
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
                                  <ChevronDown className="mr-2 h-4 w-4" />
                                ) : (
                                  <ChevronRight className="mr-2 h-4 w-4" />
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
                                            <ChevronDown className="mr-2 h-4 w-4" />
                                          ) : (
                                            <ChevronRight className="mr-2 h-4 w-4" />
                                          )}
                                          <h6 className="text-base font-semibold">
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
                                                  <div className="flex items-center cursor-pointer">
                                                    <div
                                                      onClick={() =>
                                                        toggleGroup(sectionKey)
                                                      }
                                                      className="flex items-center"
                                                    >
                                                      {openGroups[
                                                        sectionKey
                                                      ] ? (
                                                        <ChevronDown className="mr-2 h-4 w-4" />
                                                      ) : (
                                                        <ChevronRight className="mr-2 h-4 w-4" />
                                                      )}
                                                      <h6 className="text-sm font-semibold">
                                                        {section}
                                                      </h6>
                                                    </div>
                                                    <button
                                                      onClick={() => {
                                                        handleAddNoteToggle();
                                                        setnewFilters({
                                                          region,
                                                          rating,
                                                          brand,
                                                          category,
                                                          section,
                                                        });
                                                      }}
                                                      className="ml-2 p-1 bg-blue-500 text-white rounded-full"
                                                    >
                                                      <Plus className="h-4 w-4" />
                                                    </button>
                                                  </div>
                                                  {openGroups[sectionKey] && (
                                                    <div className="grid grid-cols-1 gap-4 text-xs">
                                                      {sectionNotes.map(
                                                        (note) => (
                                                          <NoteCard
                                                            key={note.id}
                                                            note={note}
                                                          />
                                                        )
                                                      )}
                                                      {isAddingNote &&
                                                        newFilters.region ===
                                                          region &&
                                                        newFilters.category ===
                                                          category &&
                                                        newFilters.rating ===
                                                          rating &&
                                                        newFilters.brand ===
                                                          brand &&
                                                        newFilters.section ===
                                                          section && (
                                                          <Card>
                                                            <CardContent className="p-2 w-full">
                                                              <Input
                                                                value={
                                                                  newNoteDescription
                                                                }
                                                                onChange={
                                                                  handleNewNoteDescriptionChange
                                                                }
                                                                placeholder="Enter note description"
                                                              />
                                                              <div>
                                                                {newNoteTags.map(
                                                                  (
                                                                    tag,
                                                                    index
                                                                  ) => (
                                                                    <Badge
                                                                      key={
                                                                        index
                                                                      }
                                                                      variant="secondary"
                                                                      className="mr-1"
                                                                    >
                                                                      <Input
                                                                        value={
                                                                          tag
                                                                        }
                                                                        onChange={(
                                                                          e
                                                                        ) =>
                                                                          handleNewNoteTagChange(
                                                                            index,
                                                                            e
                                                                              .target
                                                                              .value
                                                                          )
                                                                        }
                                                                        placeholder="Enter tag"
                                                                      />
                                                                      <Button
                                                                        onClick={() =>
                                                                          handleNewNoteTagDelete(
                                                                            index
                                                                          )
                                                                        }
                                                                        size={
                                                                          "xs"
                                                                        }
                                                                      >
                                                                        Delete
                                                                      </Button>
                                                                    </Badge>
                                                                  )
                                                                )}
                                                                <Button
                                                                  onClick={
                                                                    handleNewNoteTagAdd
                                                                  }
                                                                  size={"xs"}
                                                                >
                                                                  Add Tag
                                                                </Button>
                                                              </div>
                                                              <Button
                                                                onClick={
                                                                  handleSaveNewNote
                                                                }
                                                                size={"xs"}
                                                              >
                                                                Save
                                                              </Button>
                                                            </CardContent>
                                                          </Card>
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
    </>
  );
}
