import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Note } from "./note-app";

type NoteCardProps = {
  note: Note;
};

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Card key={note.id}>
      <CardContent className="p-2">
        <p>{note.description}</p>
        <div>
          {note.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="mr-1">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}