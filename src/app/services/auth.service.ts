// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, tap } from 'rxjs';
// import { Router } from '@angular/router';

// // const BASE = 'https://api.freeprojectapi.com/api/BusBooking';
// const BASE = 'https://freeapi.miniprojectideas.com/api/JWT/CreateNewUser';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   constructor(private http: HttpClient, private router: Router) {}

//   login(userName: string, password: string): Observable<any> {
//     return this.http.post<any>(`${BASE}/login`, { userName, password }).pipe(
//       tap(res => {
//         // if (res?.token || res?.userId) {
//         //   localStorage.setItem('auth_user', JSON.stringify(res));
//         // }
//         // NEW — stores regardless of response shape
// const toStore = (res !== null && res !== undefined) ? res : { userName };
// localStorage.setItem('auth_user', JSON.stringify(toStore));
//       })
//     );
//   }

//   register(payload: any): Observable<any> {
//     return this.http.post<any>(`${BASE}/AddNewUser`, payload);
//   }

//   logout(): void {
//     localStorage.removeItem('auth_user');
//     this.router.navigate(['/login']);
//   }

//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('auth_user');
//   }

//   getUser(): any {
//     const u = localStorage.getItem('auth_user');
//     return u ? JSON.parse(u) : null;
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

const BASE = 'https://freeapi.miniprojectideas.com/api/JWT';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Accept': 'text/plain'
});

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(emailId: string, password: string): Observable<any> {
    return this.http.post<any>(`${BASE}/Login`, { emailId, password }, { headers }).pipe(
      tap(res => {
        // Extract token and refreshToken from response
        const token = res?.token || res?.jwtToken || res?.accessToken || res?.data?.token || '';
        const refreshToken = res?.refreshToken || res?.data?.refreshToken || '';
        
        // Store only tokens
        // const tokenData = {
        //   token,
        //   refreshToken
        // };
        
        localStorage.setItem('auth_token', JSON.stringify({ token }));  
        localStorage.setItem('auth_refresh_token', JSON.stringify({ refreshToken}));  
        console.log('✓ Login successful - token stored');
      })
    );
  }

  register(payload: any): Observable<any> {
    return this.http.post<any>(`${BASE}/CreateNewUser`, payload, { headers });
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    const raw = localStorage.getItem('auth_token');
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      return data?.token || null;
    } catch {
      return null;
    }
  }

  getRefreshToken(): string | null {
    const raw = localStorage.getItem('auth_refresh_token');
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      return data?.refreshToken || null;
    } catch {
      return null;
    }
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return throwError(() => new Error('No refresh token available'));
    
    return this.http.post<any>(`${BASE}/refresh`, { refreshToken }, { headers }).pipe(
      tap(res => {
        const newToken = res?.token || res?.jwtToken || res?.accessToken || res?.data?.token || '';
        const newRefreshToken = res?.refreshToken || res?.data?.refreshToken || refreshToken;
        
        localStorage.setItem('auth_token', JSON.stringify({ token: newToken }));
        localStorage.setItem('auth_refresh_token', JSON.stringify({ refreshToken: newRefreshToken }));
        console.log('✓ Token refreshed successfully');
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  // Deprecated - kept for backward compatibility
  getUser(): any {
    return { token: this.getToken(), refreshToken: this.getRefreshToken() };
  }
}