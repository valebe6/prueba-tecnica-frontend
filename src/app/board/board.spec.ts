import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Board } from './board';
import { NotesService } from '../core/services/notes.service';

describe('Board', () => {
  let component: Board;
  let fixture: ComponentFixture<Board>;

  const mockNotesService = {
    getNotes: vi.fn().mockReturnValue(of([])),
    createNote: vi.fn(),
    updateNote: vi.fn(),
    deleteNote: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Board],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: NotesService, useValue: mockNotesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Board);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
