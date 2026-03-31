
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, map, catchError, throwError } from 'rxjs';
// import { User } from '../models/user.model';

// const BASE = 'https://api.freeprojectapi.com/api/BusBooking';

// const headers = new HttpHeaders({
//   'Content-Type': 'application/json',
//   'Accept': 'application/json'
// });

// @Injectable({ providedIn: 'root' })
// export class UserService {
//   constructor(private http: HttpClient) {}

//   // Utility: extract array from any API response shape
//   private toArray(res: any): User[] {
//     console.log('Raw API response:', JSON.stringify(res));
//     if (!res) return [];
//     if (Array.isArray(res)) return res;
//     // Wrapped: { data:[...] } | { users:[...] } | { result:[...] } etc.
//     for (const key of ['data','users','result','value','items','records','list','$values']) {
//       if (Array.isArray(res[key])) return res[key];
//     }
//     // Single user object returned
//     if (res.userId !== undefined) return [res];
//     // Object with numeric keys: { "0":{...}, "1":{...} }
//     const vals = Object.values(res);
//     if (vals.length && typeof vals[0] === 'object') return vals as User[];
//     return [];
//   }

//   getAll(): Observable<User[]> {
//     return this.http.get<any>(`${BASE}/GetAllUsers`, { headers }).pipe(
//       map(res => this.toArray(res)),
//       catchError(err => { console.error('getAll error', err); return throwError(() => err); })
//     );
//   }

//   getById(id: number): Observable<User> {
//     return this.http.get<User>(`${BASE}/GetUserById/${id}`, { headers });
//   }

//   create(user: any): Observable<any> {
//     const payload = {
//       userId: 0,
//       userName: user.userName || '',
//       fullName: user.fullName || '',
//       emailId: user.emailId || '',
//       password: user.password || '',
//       role: user.role || 'User',
//       projectName: user.projectName || 'BusBooking',
//       refreshToken: '',
//       refreshTokenExpiryTime: new Date().toISOString(),
//       createdDate: new Date().toISOString()
//     };
//     console.log('CREATE payload:', payload);
//     return this.http.post<any>(`${BASE}/AddNewUser`, payload, { headers }).pipe(
//       catchError(err => { console.error('create error', err); return throwError(() => err); })
//     );
//   }

//   update(user: any): Observable<any> {
//     const payload = {
//       userId: user.userId,
//       userName: user.userName || '',
//       fullName: user.fullName || '',
//       emailId: user.emailId || '',
//       password: user.password || '',
//       role: user.role || 'User',
//       projectName: user.projectName || 'BusBooking',
//       refreshToken: user.refreshToken || '',
//       refreshTokenExpiryTime: user.refreshTokenExpiryTime || new Date().toISOString(),
//       createdDate: user.createdDate || new Date().toISOString()
//     };
//     console.log('UPDATE payload:', payload);
//     return this.http.post<any>(`${BASE}/UpdateUser`, payload, { headers }).pipe(
//       catchError(err => { console.error('update error', err); return throwError(() => err); })
//     );
//   }

//  delete(id: number): Observable<any> {
//   console.log('DELETE userId:', id);

//   return this.http.delete<any>(
//     `${BASE}/DeleteUserByUserId?userId=${id}`,
//     { headers }
//   );
// }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

const BASE = 'https://freeapi.miniprojectideas.com/api/JWT';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  // Build headers — include Bearer token if available
  private get headers(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept':       'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  // Unwrap any response shape the API might return
  private toArray(res: any): User[] {
    console.log('GetAllUsers raw response:', res);
    if (!res) return [];
    // Flat array: [{ userId, userName, ... }]
    if (Array.isArray(res)) return res;
    // Wrapped: { result: true, data: [...] }
    if (Array.isArray(res?.data))    return res.data;
    if (Array.isArray(res?.result))  return res.result;
    if (Array.isArray(res?.users))   return res.users;
    if (Array.isArray(res?.value))   return res.value;
    if (Array.isArray(res?.list))    return res.list;
    // Single user object
    if (res?.userId !== undefined)   return [res];
    // Object with numeric keys: { "0":{...}, "1":{...} }
    const vals = Object.values(res ?? {});
    if (vals.length && typeof vals[0] === 'object') return vals as User[];
    return [];
  }

  getAll(): Observable<User[]> {
    return this.http.get<any>(`${BASE}/GetAllUsers`, { headers: this.headers }).pipe(
      map(res => this.toArray(res)),
      catchError(err => { console.error('getAll error:', err); return throwError(() => err); })
    );
  }

  create(user: Partial<User>): Observable<any> {
    const payload = {
      userId:      0,
      firstName:   user.firstName || '',
      middleName:  user.middleName || '',
      lastName:    user.lastName || '',
      emailId:     user.emailId || '',
      password:    user.password || '',
      mobileNo:    user.mobileNo || '',
      altMobileNo: user.altMobileNo || '',
      userAddress: user.userAddress || { city: '', state: '', pincode: '', addressLine: '' },
      userSocialDetails: user.userSocialDetails || { facebookProfileUrl: '', linkdinProfileUrl: '', instagramHandle: '', twitterHandle: '' }
    };
    console.log('CREATE payload:', payload);
    return this.http.post<any>(`${BASE}/CreateNewUser`, payload, { headers: this.headers }).pipe(
      catchError(err => { console.error('create error:', err); return throwError(() => err); })
    );
  }

  update(user: Partial<User>): Observable<any> {
    const payload = {
      userId:      user.userId || 0,
      firstName:   user.firstName || '',
      middleName:  user.middleName || '',
      lastName:    user.lastName || '',
      emailId:     user.emailId || '',
      password:    user.password || '',
      mobileNo:    user.mobileNo || '',
      altMobileNo: user.altMobileNo || '',
      userAddress: user.userAddress || { city: '', state: '', pincode: '', addressLine: '' },
      userSocialDetails: user.userSocialDetails || { facebookProfileUrl: '', linkdinProfileUrl: '', instagramHandle: '', twitterHandle: '' }
    };
    console.log('UPDATE payload:', payload);
    return this.http.put<any>(`${BASE}/UpdateUser`, payload, { headers: this.headers }).pipe(
      catchError(err => { console.error('update error:', err); return throwError(() => err); })
    );
  }

  delete(id: number): Observable<any> {
    console.log('DELETE userId:', id);
    return this.http.delete<any>(`${BASE}/DeleteUser/${id}`, { headers: this.headers }).pipe(
      catchError(err => { console.error('delete error:', err); return throwError(() => err); })
    );
  }
}