
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { UserService } from '../../services/user.service';
// import { AuthService } from '../../services/auth.service';
// import { User } from '../../models/user.model';
// import { AdminCountPipe } from '../../pipes/admin-count.pipe';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, FormsModule, AdminCountPipe],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss']
// })
// export class DashboardComponent implements OnInit {
//   users: User[]    = [];
//   filtered: User[] = [];
//   loading          = false;
//   formLoading      = false;
//   error            = '';
//   success          = '';

//   searchName = '';
//   searchId   = '';

//   showModal        = false;
//   modalMode: 'add' | 'edit' = 'add';
//   showViewModal    = false;
//   showDeleteModal  = false;
//   deleteTargetId: number | null = null;
//   viewUser: User | null = null;

//   form!: FormGroup;
//   currentUser: any;

//   // Stores the original full user row for edit (to preserve refreshToken etc.)
//   private editingUser: User | null = null;

//   constructor(
//     private userSvc: UserService,
//     private auth: AuthService,
//     private fb: FormBuilder
//   ) {}

//   ngOnInit(): void {
//     this.currentUser = this.auth.getUser();
//     this.buildForm();
//     this.loadUsers();
//   }

//   // ─── Form ────────────────────────────────────────────────────────────────────

//   buildForm(u?: User): void {
//     this.form = this.fb.group({
//       userName:    [u?.userName    ?? '', Validators.required],
//       fullName:    [u?.fullName    ?? '', Validators.required],
//       emailId:     [u?.emailId     ?? '', [Validators.required, Validators.email]],
//       password:    [u?.password    ?? '', this.modalMode === 'add' ? [Validators.required, Validators.minLength(6)] : []],
//       role:        [u?.role        ?? 'User', Validators.required],
//       projectName: [u?.projectName ?? 'BusBooking']
//     });
//   }

//   // ─── Load ─────────────────────────────────────────────────────────────────

//   loadUsers(): void {
//     this.loading = true;
//     this.error   = '';
//     this.userSvc.getAll().subscribe({
//       next: (data) => {
//         this.users   = Array.isArray(data) ? data : [];
//         this.loading = false;
//         this.applyFilter();
//       },
//       error: (e) => {
//         this.loading = false;
//         this.users   = [];
//         this.filtered = [];
//         this.error = this.extractError(e, 'Failed to load users.');
//       }
//     });
//   }

//   // ─── Filter ───────────────────────────────────────────────────────────────

//   applyFilter(): void {
//     if (!Array.isArray(this.users)) { this.filtered = []; return; }
//     const name = this.searchName.trim().toLowerCase();
//     const id   = this.searchId.trim();
//     this.filtered = this.users.filter(u => {
//       const matchName = name
//         ? (u.userName ?? '').toLowerCase().includes(name) ||
//           (u.fullName ?? '').toLowerCase().includes(name)
//         : true;
//       const matchId = id ? String(u.userId) === id : true;
//       return matchName && matchId;
//     });
//   }

//   clearFilters(): void {
//     this.searchName = '';
//     this.searchId   = '';
//     this.applyFilter();
//   }

//   // ─── Open modals ─────────────────────────────────────────────────────────

//   openAdd(): void {
//     this.modalMode    = 'add';
//     this.editingUser  = null;
//     this.error        = '';
//     this.buildForm();
//     this.showModal    = true;
//   }

//   openEdit(u: User): void {
//     this.modalMode    = 'edit';
//     this.editingUser  = u;
//     this.error        = '';
//     this.buildForm(u);
//     this.showModal    = true;
//     this.showViewModal = false;
//   }

//   openView(u: User): void {
//     this.viewUser      = u;
//     this.showViewModal = true;
//   }

//   openDelete(id: number): void {
//     this.deleteTargetId  = id;
//     this.showDeleteModal = true;
//   }

//   closeAll(): void {
//     this.showModal       = false;
//     this.showViewModal   = false;
//     this.showDeleteModal = false;
//     this.deleteTargetId  = null;
//     this.viewUser        = null;
//     this.error           = '';
//   }

//   // ─── CRUD ─────────────────────────────────────────────────────────────────

//   submitForm(): void {
//     if (this.form.invalid) { this.form.markAllAsTouched(); return; }
//     this.formLoading = true;
//     this.error       = '';

//     const v = this.form.value;

//     if (this.modalMode === 'add') {
//       this.userSvc.create(v).subscribe({
//         next: () => {
//           this.formLoading = false;
//           this.closeAll();
//           this.toast('User added successfully!');
//           this.loadUsers();
//         },
//         error: (e) => {
//           this.formLoading = false;
//           this.error = this.extractError(e, 'Failed to add user.');
//         }
//       });

//     } else {
//       // Merge new form values onto the original user so no fields are lost
//       const payload = { ...this.editingUser, ...v };
//       this.userSvc.update(payload).subscribe({
//         next: () => {
//           this.formLoading = false;
//           this.closeAll();
//           this.toast('User updated successfully!');
//           this.loadUsers();
//         },
//         error: (e) => {
//           this.formLoading = false;
//           this.error = this.extractError(e, 'Failed to update user.');
//         }
//       });
//     }
//   }

//   confirmDelete(): void {
//     if (this.deleteTargetId == null) return;
//     this.userSvc.delete(this.deleteTargetId).subscribe({
//       next: () => {
//         this.closeAll();
//         this.toast('User deleted successfully!');
//         this.loadUsers();
//       },
//       error: (e) => {
//         this.error = this.extractError(e, 'Failed to delete user.');
//         this.showDeleteModal = false;
//       }
//     });
//   }

//   // ─── Helpers ─────────────────────────────────────────────────────────────

//   logout(): void { this.auth.logout(); }

//   toast(msg: string): void {
//     this.success = msg;
//     setTimeout(() => (this.success = ''), 3500);
//   }

//   extractError(e: any, fallback: string): string {
//     if (e?.status === 0)   return 'Network error — cannot reach the API server.';
//     if (e?.status === 401) return 'Unauthorised (401). Please log in again.';
//     if (e?.status === 404) return 'API endpoint not found (404).';
//     if (e?.status >= 500)  return `Server error (${e.status}). Try again later.`;
//     return e?.error?.message || e?.error?.title || e?.message || fallback;
//   }

//   trackById(_: number, u: User): number { return u.userId; }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { AdminCountPipe } from '../../pipes/admin-count.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AdminCountPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  users: User[]    = [];
  filtered: User[] = [];
  pagedUsers: User[] = [];
  loading          = false;
  formLoading      = false;
  error            = '';
  success          = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  searchName = '';
  searchId   = '';

  showModal        = false;
  modalMode: 'add' | 'edit' = 'add';
  showViewModal    = false;
  showDeleteModal  = false;
  deleteTargetId: number | null = null;
  viewUser: User | null = null;

  form!: FormGroup;
  currentUser: any;
  private editingUser: User | null = null;

  constructor(
    private userSvc: UserService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getUser();
    this.buildForm();
    this.loadUsers();
  }

  buildForm(u?: User): void {
    this.form = this.fb.group({
      firstName:   [u?.firstName   ?? '', Validators.required],
      middleName:  [u?.middleName  ?? ''],
      lastName:    [u?.lastName    ?? '', Validators.required],
      emailId:     [u?.emailId     ?? '', [Validators.required, Validators.email]],
      mobileNo:    [u?.mobileNo    ?? '', Validators.required],
      altMobileNo: [u?.altMobileNo ?? ''],
      password:    [u?.password    ?? '',
        this.modalMode === 'add' ? [Validators.required, Validators.minLength(6)] : []],
      // address fields flattened
      addressLine: [u?.userAddress?.addressLine ?? ''],
      city:        [u?.userAddress?.city        ?? ''],
      state:       [u?.userAddress?.state       ?? ''],
      pincode:     [u?.userAddress?.pincode     ?? ''],
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.error   = '';
    this.userSvc.getAll().subscribe({
      next: (data) => {
        this.users   = Array.isArray(data) ? data : [];
        this.loading = false;
        this.applyFilter();
      },
      error: (e) => {
        this.loading  = false;
        this.users    = [];
        this.filtered = [];
        this.error    = this.extractError(e, 'Failed to load users.');
      }
    });
  }

  applyFilter(): void {
    if (!Array.isArray(this.users)) { this.filtered = []; return; }
    const name = this.searchName.trim().toLowerCase();
    const id   = this.searchId.trim();
    this.filtered = this.users.filter(u => {
      const fullName = `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase();
      const matchName = name
        ? fullName.includes(name) || (u.emailId ?? '').toLowerCase().includes(name)
        : true;
      const matchId = id ? String(u.userId) === id : true;
      return matchName && matchId;
    });
    this.currentPage = 1; // Reset to first page
    this.updatePagedUsers();
  }

  updatePagedUsers(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedUsers = this.filtered.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedUsers();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedUsers();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedUsers();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filtered.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  clearFilters(): void { this.searchName = ''; this.searchId = ''; this.applyFilter(); }

  openAdd(): void {
    this.modalMode   = 'add';
    this.editingUser = null;
    this.error       = '';
    this.buildForm();
    this.showModal   = true;
  }

  openEdit(u: User): void {
    this.modalMode     = 'edit';
    this.editingUser   = u;
    this.error         = '';
    this.buildForm(u);
    this.showModal     = true;
    this.showViewModal = false;
  }

  openView(u: User): void { this.viewUser = u; this.showViewModal = true; }

  openDelete(id: number): void { this.deleteTargetId = id; this.showDeleteModal = true; }

  closeAll(): void {
    this.showModal = this.showViewModal = this.showDeleteModal = false;
    this.deleteTargetId = null;
    this.viewUser = null;
    this.error = '';
  }

  submitForm(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.formLoading = true;
    this.error       = '';
    const v = this.form.value;

    const payload = {
      ...(this.editingUser ?? {}),
      firstName:   v.firstName,
      middleName:  v.middleName  || '',
      lastName:    v.lastName,
      emailId:     v.emailId,
      mobileNo:    v.mobileNo,
      altMobileNo: v.altMobileNo || '',
      password:    v.password    || this.editingUser?.password || '',
      userAddress: { addressLine: v.addressLine || '', city: v.city || '', state: v.state || '', pincode: v.pincode || '' },
      userSocialDetails: this.editingUser?.userSocialDetails ??
        { facebookProfileUrl: '', linkdinProfileUrl: '', instagramHandle: '', twitterHandle: '' }
    };

    const action = this.modalMode === 'add'
      ? this.userSvc.create(payload)
      : this.userSvc.update(payload);

    action.subscribe({
      next: () => {
        this.formLoading = false;
        this.closeAll();
        this.toast(this.modalMode === 'add' ? 'User added successfully!' : 'User updated successfully!');
        this.loadUsers();
      },
      error: (e) => { this.formLoading = false; this.error = this.extractError(e, 'Operation failed.'); }
    });
  }

  confirmDelete(): void {
    if (this.deleteTargetId == null) return;
    this.userSvc.delete(this.deleteTargetId).subscribe({
      next: () => { this.closeAll(); this.toast('User deleted successfully!'); this.loadUsers(); },
      error: (e) => { this.error = this.extractError(e, 'Delete failed.'); this.showDeleteModal = false; }
    });
  }

  logout(): void { this.auth.logout(); }

  toast(msg: string): void { this.success = msg; setTimeout(() => (this.success = ''), 3500); }

  extractError(e: any, fallback: string): string {
    if (e?.status === 0)   return 'Network error — cannot reach the API server.';
    if (e?.status === 401) return 'Unauthorised (401). Please log in again.';
    if (e?.status === 404) return 'API endpoint not found (404).';
    if (e?.status >= 500)  return `Server error (${e.status}). Try again later.`;
    return e?.error?.message || e?.error?.title || e?.message || fallback;
  }

  fullName(u: User): string {
    return [u.firstName, u.middleName, u.lastName].filter(Boolean).join(' ');
  }

  trackById(_: number, u: User): number { return u.userId; }
}