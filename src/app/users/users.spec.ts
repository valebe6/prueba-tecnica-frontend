import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Users } from './users';
import { UsersService, User } from '../core/services/users.service';
import { AuthService } from '../core/services/auth.service';

describe('Users', () => {
  let component: Users;
  let fixture: ComponentFixture<Users>;

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'ADMIN',
      active: true,
    },
    {
      id: '2',
      name: 'Regular User',
      email: 'user@test.com',
      role: 'USER',
      active: false,
    },
  ];

  const mockUsersService = {
    getUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    toggleStatus: vi.fn(),
  };

  const mockAuthService = {
    isAdmin: vi.fn().mockReturnValue(true),
    logout: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockUsersService.getUsers.mockReturnValue(of(mockUsers));

    await TestBed.configureTestingModule({
      imports: [Users],
      providers: [
        provideRouter([]),
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Users);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load users on init', () => {
    expect(component).toBeTruthy();
    expect(mockUsersService.getUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
  });

  it('should open create modal with empty form', () => {
    component.openCreateModal();
    expect(component.isModalOpen).toBe(true);
    expect(component.editingUser).toBeNull();
    expect(component.userForm.value.name).toBe('');
    expect(component.userForm.value.role).toBe('USER');
  });

  it('should open edit modal with user data', () => {
    component.openEditModal(mockUsers[0]);
    expect(component.isModalOpen).toBe(true);
    expect(component.editingUser).toEqual(mockUsers[0]);
    expect(component.userForm.value.name).toBe('Admin User');
    expect(component.userForm.value.email).toBe('admin@test.com');
    expect(component.userForm.value.role).toBe('ADMIN');
  });

  it('should close modal', () => {
    component.openCreateModal();
    component.closeModal();
    expect(component.isModalOpen).toBe(false);
    expect(component.editingUser).toBeNull();
  });

  it('should create a new user when saving in create mode', () => {
    const newUser: User = {
      id: '3',
      name: 'New User',
      email: 'new@test.com',
      role: 'USER',
      active: true,
    };
    mockUsersService.createUser.mockReturnValue(of(newUser));

    component.openCreateModal();
    component.userForm.setValue({
      name: 'New User',
      email: 'new@test.com',
      password: 'password123',
      role: 'USER',
    });

    component.saveUser();

    expect(mockUsersService.createUser).toHaveBeenCalledWith({
      name: 'New User',
      email: 'new@test.com',
      password: 'password123',
      role: 'USER',
    });
    expect(component.isModalOpen).toBe(false);
  });

  it('should update an existing user when saving in edit mode', () => {
    const updatedUser: User = {
      ...mockUsers[0],
      name: 'Updated Name',
      role: 'ADMIN',
    };
    mockUsersService.updateUser.mockReturnValue(of(updatedUser));

    component.openEditModal(mockUsers[0]);
    component.userForm.patchValue({
      name: 'Updated Name',
    });

    component.saveUser();

    expect(mockUsersService.updateUser).toHaveBeenCalledWith('1', {
      name: 'Updated Name',
      email: 'admin@test.com',
      role: 'ADMIN',
    });
    expect(component.isModalOpen).toBe(false);
  });

  it('should toggle user status after confirmation', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockUsersService.toggleStatus.mockReturnValue(
      of({ ...mockUsers[0], active: false }),
    );

    component.toggleStatus(mockUsers[0]);

    expect(mockUsersService.toggleStatus).toHaveBeenCalledWith('1');
    expect(component.users[0].active).toBe(false);
  });

  it('should handle toggle status error (e.g. last active admin)', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockUsersService.toggleStatus.mockReturnValue(
      throwError(() => ({
        error: { message: 'Debe existir al menos un administrador activo' },
      })),
    );

    component.toggleStatus(mockUsers[0]);

    expect(component.errorMessage).toBe(
      'Debe existir al menos un administrador activo',
    );
  });
});
