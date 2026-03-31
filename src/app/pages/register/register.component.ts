// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.scss']
// })
// export class RegisterComponent {
//   form: FormGroup;
//   loading = false;
//   error = '';
//   success = '';
//   showPass = false;

//   constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
//     this.form = this.fb.group({
//       userName: ['', Validators.required],
//       fullName: ['', Validators.required],
//       emailId: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       role: ['User', Validators.required],
//       projectName: ['BusBooking']
//     });
//   }

//   submit(): void {
//     if (this.form.invalid) { this.form.markAllAsTouched(); return; }
//     this.loading = true;
//     this.error = '';
//     this.auth.register(this.form.value).subscribe({
//       next: () => {
//         this.loading = false;
//         this.success = 'Account created! Redirecting to login...';
//         setTimeout(() => this.router.navigate(['/login']), 1800);
//       },
//       error: (e) => { this.loading = false; this.error = e?.error?.message || 'Registration failed. Please try again.'; }
//     });
//   }
// }


import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  loading  = false;
  error    = '';
  success  = '';
  showPass = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      firstName:   ['', Validators.required],
      middleName:  [''],
      lastName:    ['', Validators.required],
      emailId:     ['', [Validators.required, Validators.email]],
      mobileNo:    ['', Validators.required],
      altMobileNo: [''],
      password:    ['', [Validators.required, Validators.minLength(6)]],
      // address
      addressLine: [''],
      city:        [''],
      state:       [''],
      pincode:     [''],
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error   = '';

    const v = this.form.value;
    const payload = {
      userId:      0,
      firstName:   v.firstName,
      middleName:  v.middleName  || '',
      lastName:    v.lastName,
      mobileNo:    v.mobileNo,
      emailId:     v.emailId,
      altMobileNo: v.altMobileNo || '',
      password:    v.password,
      userAddress: {
        city:        v.city        || '',
        state:       v.state       || '',
        pincode:     v.pincode     || '',
        addressLine: v.addressLine || ''
      },
      userSocialDetails: {
        facebookProfileUrl: '',
        linkdinProfileUrl:  '',
        instagramHandle:    '',
        twitterHandle:      ''
      }
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Account created! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1800);
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message || e?.message || 'Registration failed. Please try again.';
      }
    });
  }
}