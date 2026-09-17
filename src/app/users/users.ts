import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavbarComponent } from '../layout/navbar/navbar';
import {
  User,
  UserRole,
  UsersService,
} from '../core/services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users: User[] = [];
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  modalError = '';

  isModalOpen = false;
  editingUser: User | null = null;
  userForm: FormGroup;

  roles: UserRole[] = ['USER', 'ADMIN'];

  constructor(
    private readonly usersService: UsersService,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.userForm = this.buildCreateForm();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message || 'Error al cargar los usuarios.';
        this.cdr.markForCheck();
      },
    });
  }

  openCreateModal(): void {
    this.editingUser = null;
    this.modalError = '';
    this.userForm = this.buildCreateForm();
    this.isModalOpen = true;
    this.cdr.markForCheck();
  }

  openEditModal(user: User): void {
    this.editingUser = user;
    this.modalError = '';
    this.userForm = this.buildEditForm(user);
    this.isModalOpen = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingUser = null;
    this.modalError = '';
    this.userForm.reset();
    this.cdr.markForCheck();
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.modalError = '';

    const formValues = this.userForm.value;

    if (this.editingUser) {
      const updateData: {
        name: string;
        email: string;
        role: UserRole;
        password?: string;
      } = {
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        role: formValues.role,
      };

      if (formValues.password && formValues.password.trim().length > 0) {
        updateData.password = formValues.password;
      }

      this.usersService.updateUser(this.editingUser.id, updateData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeModal();
          this.showSuccess('Usuario actualizado correctamente');
          this.loadUsers();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.modalError =
            err?.error?.message || 'Error al actualizar el usuario.';
          this.cdr.markForCheck();
        },
      });
    } else {
      const createData = {
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
        role: formValues.role,
      };

      this.usersService.createUser(createData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeModal();
          this.showSuccess('Usuario creado exitosamente');
          this.loadUsers();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.modalError =
            err?.error?.message || 'Error al crear el usuario.';
          this.cdr.markForCheck();
        },
      });
    }
  }

  toggleStatus(user: User): void {
    const actionName = user.active ? 'desactivar' : 'reactivar';
    const confirmed = confirm(
      `¿Estás seguro de ${actionName} a ${user.name}?`,
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.usersService.toggleStatus(user.id).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], active: updatedUser.active };
        }
        this.showSuccess(
          `Usuario ${updatedUser.active ? 'reactivado' : 'desactivado'} con éxito`,
        );
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message || `Error al ${actionName} el usuario.`;
        this.cdr.markForCheck();
      },
    });
  }

  private buildCreateForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER' as UserRole, [Validators.required]],
    });
  }

  private buildEditForm(user: User): FormGroup {
    return this.fb.group({
      name: [user.name, [Validators.required, Validators.minLength(2)]],
      email: [user.email, [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      role: [user.role, [Validators.required]],
    });
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.markForCheck();
    }, 4000);
    this.cdr.markForCheck();
  }
}
