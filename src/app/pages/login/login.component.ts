// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent {
//   form: FormGroup;
//   loading = false;
//   error = '';
//   showPass = false;

//   constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
//     this.form = this.fb.group({
//       userName: ['', Validators.required],
//       password: ['', Validators.required]
//     });
//   }

//   submit(): void {
//     if (this.form.invalid) { this.form.markAllAsTouched(); return; }
//     this.loading = true;
//     this.error = '';
//     const { userName, password } = this.form.value;
//     this.auth.login(userName, password).subscribe({
//       next: () => { this.loading = false; this.router.navigate(['/dashboard']); },
//       error: (e) => { this.loading = false; this.error = e?.error?.message || 'Invalid credentials. Please try again.'; }
//     });

    
//   }
// }



import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading  = false;
  error    = '';
  showPass = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn()) this.router.navigate(['/dashboard']);
    this.form = this.fb.group({
      emailId:  ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error   = '';
    const { emailId, password } = this.form.value;
    this.auth.login(emailId, password).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/dashboard']); },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message || e?.message || 'Invalid credentials. Please try again.';
      }
    });
  }
}