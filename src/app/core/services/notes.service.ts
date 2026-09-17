import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type NoteStatus = 'PENDIENTE' | 'EN_CURSO' | 'HECHO';

export interface Note {
  id: string;
  title: string;
  text: string;
  status: NoteStatus;
  positionX: number;
  positionY: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private readonly apiUrl = 'http://localhost:3000/notes';

  constructor(private readonly http: HttpClient) {}

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  createNote(note: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note);
  }

  updateNote(id: string, note: Partial<Note>): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/${id}`, note);
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
