import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Note } from "./note-app";

type NoteCardProps = {
  note: Note;
};

export function NoteCard({ note }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(note.description);
  const [tags, setTags] = useState(note.tags);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleTagChange = (index, newTag) => {
    const newTags = [...tags];
    newTags[index] = newTag;
    setTags(newTags);
  };

  const handleTagDelete = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const handleTagAdd = () => {
    setTags([...tags, ""]);
  };

  const handleSave = () => {
    // Save the updated note and tags
    // You can add your save logic here
    setIsEditing(false);
  };

  return (
    <Card key={note.id}>
      <CardContent className="p-2 flex flex-col gap-2">
        {isEditing ? (
          <>
            <Input
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
              multiline
            />
            <div>
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="mr-1">
                  <Input
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                  />
                  <Button onClick={() => handleTagDelete(index)} size={"xs"}>Delete</Button>
                </Badge>
              ))}
              <Button onClick={handleTagAdd} size={"xs"}>Add Tag</Button>
            </div>
            <Button onClick={handleSave} size={"xs"}>Save</Button>
          </>
        ) : (
          <>
            <p>{description}</p>
            <div className="flex justify-between">
              <div>
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="mr-1">
                  {tag}
                </Badge>
              ))}
              </div>
              <Button onClick={handleEditToggle} size={"xs"}>
                Edit
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
