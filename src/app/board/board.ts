import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Note, NotesService, NoteStatus } from '../core/services/notes.service';
import { CdkDrag, CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../layout/navbar/navbar';

@Component({
  imports: [CdkDrag, FormsModule, NavbarComponent],
  standalone: true,
  selector: 'app-board',
  styleUrl: './board.css',
  templateUrl: './board.html',
})
export class Board implements OnInit {
  notes: Note[] = [];

  statuses: NoteStatus[] = ['PENDIENTE', 'EN_CURSO', 'HECHO'];

  constructor(
    private readonly notesService: NotesService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.notesService.getNotes().subscribe((notes) => {
      this.notes = notes;
      this.cdr.markForCheck();
    });
  }

  createNote(): void {
    this.notesService
      .createNote({
        title: 'Nueva nota',
        text: '',
        status: 'PENDIENTE',
        positionX: 100,
        positionY: 100,
      })
      .subscribe((note) => {
        this.notes.push(note);
        this.cdr.markForCheck();
      });
  }

  saveNote(note: Note): void {
    this.notesService
      .updateNote(note.id, {
        title: note.title,
        text: note.text,
        status: note.status,
      })
      .subscribe();
  }

  deleteNote(note: Note): void {
    this.notesService.deleteNote(note.id).subscribe(() => {
      this.notes = this.notes.filter((item) => item.id !== note.id);
    });
  }

  onDragEnd(event: CdkDragEnd, note: Note): void {
    const position = event.source.getFreeDragPosition();

    note.positionX = position.x;
    note.positionY = position.y;

    event.source.reset();

    this.notesService
      .updateNote(note.id, {
        positionX: note.positionX,
        positionY: note.positionY,
      })
      .subscribe();
  }
}
