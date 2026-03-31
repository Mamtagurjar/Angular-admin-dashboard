# BusBooking Angular Admin Panel

A production-ready Angular 19 application with **Login**, **Register**, and a full **CRUD Dashboard** for user management.

---

## 📁 Project Structure & Deep Explanation

```
my-app/
├── src/
│   ├── app/
│   │   ├── guards/
│   │   │   └── auth.guard.ts          # Route protection
│   │   ├── models/
│   │   │   └── user.model.ts          # TypeScript interface for User
│   │   ├── pages/
│   │   │   ├── login/                 # Login page (standalone component)
│   │   │   ├── register/              # Register page (standalone component)
│   │   │   └── dashboard/             # Dashboard with CRUD (standalone component)
│   │   ├── pipes/
│   │   │   └── admin-count.pipe.ts    # Custom pipe for counting admins
│   │   ├── services/
│   │   │   ├── auth.service.ts        # Login/Register/Logout logic
│   │   │   └── user.service.ts        # CRUD API calls for users
│   │   ├── shared-auth.scss           # Shared styles for Login & Register
│   │   ├── app.routes.ts              # All route definitions
│   │   ├── app.config.ts              # Angular app configuration
│   │   └── app.ts                     # Root component (router outlet)
│   ├── index.html                     # Entry HTML with Google Fonts
│   ├── main.ts                        # Bootstrap entry point
│   └── styles.scss                    # Global styles & resets
├── angular.json                       # Angular CLI configuration
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
└── README.md
```

---

## 🔄 Complete Application Workflow

### 1. Bootstrap (`main.ts`)
Angular starts by calling `bootstrapApplication(AppComponent, appConfig)`.
- `appConfig` provides: Router, HttpClient (with fetch API), ZoneChangeDetection
- `AppComponent` is just a `<router-outlet>` — it renders whichever route is active

### 2. Routing (`app.routes.ts`)
| Path | Component | Guard |
|------|-----------|-------|
| `/` | Redirects → `/login` | — |
| `/login` | `LoginComponent` | — |
| `/register` | `RegisterComponent` | — |
| `/dashboard` | `DashboardComponent` | `authGuard` ✅ |
| `**` | Redirects → `/login` | — |

All components are **lazy-loaded** using `loadComponent()` — this means each page's code is only downloaded when the user first visits it, keeping initial bundle size small.

### 3. Auth Guard (`auth.guard.ts`)
```
User visits /dashboard
       ↓
authGuard checks localStorage for 'auth_user'
       ↓
  Found? → Allow access to Dashboard
  Not found? → Redirect to /login
```

### 4. Login Flow
```
User fills Username + Password
       ↓
POST https://api.freeprojectapi.com/api/BusBooking/login
  { "userName": "...", "password": "..." }
       ↓
  Success → Save response to localStorage('auth_user')
          → Navigate to /dashboard
  Error   → Show error alert (red banner)
```

### 5. Register Flow
```
User fills all fields
       ↓
POST https://api.freeprojectapi.com/api/BusBooking/AddNewUser
  { userName, fullName, emailId, password, role, projectName }
       ↓
  Success → Show green success banner → Redirect to /login after 1.8s
  Error   → Show error alert
```

### 6. Dashboard Flow
```
Component initializes (ngOnInit)
       ↓
loadUsers() → GET /api/BusBooking/GetAllUsers
       ↓
Display users in table with:
  - Filter by name/username (live search)
  - Filter by User ID (exact match)
  - Stats: Total users, Filtered count, Admin count
       ↓
CRUD Operations:
  ┌─ ADD    → POST  /AddNewUser
  ├─ EDIT   → PUT   /UpdateUser
  ├─ DELETE → DELETE /DeleteUser/:id
  └─ VIEW   → Opens detail modal
```

### 7. Services

**`AuthService`**
- `login(userName, password)` — calls the login API, stores the response token/user in localStorage
- `register(payload)` — calls AddNewUser API
- `isLoggedIn()` — checks localStorage for the saved user (used by auth guard)
- `getUser()` — retrieves the current logged-in user object
- `logout()` — clears localStorage and redirects to `/login`

**`UserService`**
- `getAll()` — GET all users
- `getById(id)` — GET single user by ID
- `create(user)` — POST create new user
- `update(user)` — PUT update existing user
- `delete(id)` — DELETE user by ID

### 8. Forms (Reactive Forms)
Both Login and Dashboard forms use Angular's `ReactiveFormsModule`:
- `FormBuilder` creates the form structure
- `Validators.required`, `Validators.email`, `Validators.minLength` handle validation
- `form.markAllAsTouched()` reveals all errors on submit attempt
- Error messages appear only after the field is `touched` and `invalid`

### 9. Standalone Components (Angular 17+)
Every component uses `standalone: true` — no `NgModule` needed. Each component declares exactly what it imports in its own `imports: []` array.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Angular CLI 19: `npm install -g @angular/cli`

### Installation & Run
```bash
# 1. Extract the zip and navigate into the project
cd my-app

# 2. Install dependencies
npm install

# 3. Start development server
ng serve

# 4. Open browser
# http://localhost:4200
```

### Build for Production
```bash
ng build
# Output goes to /dist/my-app
```

---

## 🎨 UI Design Decisions

- **Font**: Plus Jakarta Sans (Google Fonts) — clean, modern, professional
- **Color scheme**: Light blue-tinted whites (`#F0F4FF`, `#F8FAFF`) with a strong blue accent (`#4F6EF7`)
- **Animations**: Card entrance animations, modal slide-ins, button hover effects
- **Responsive**: Sidebar collapses to icon-only mode on screens < 900px
- **Role badges**: Color-coded (Admin=purple, User=blue, Manager=green)

---

## 📡 API Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/BusBooking/login` | Login |
| POST | `/api/BusBooking/AddNewUser` | Register / Add user |
| GET | `/api/BusBooking/GetAllUsers` | Get all users |
| PUT | `/api/BusBooking/UpdateUser` | Update user |
| DELETE | `/api/BusBooking/DeleteUser/:id` | Delete user |

Base URL: `https://api.freeprojectapi.com`

---

## 🔐 Security Notes

- Passwords are sent as plain text to match the API contract — in production, always use HTTPS and hashed passwords
- The auth guard prevents unauthorized access to the dashboard
- LocalStorage is used for session persistence — for higher security, consider using `sessionStorage` or HTTP-only cookies with a backend session

---

## 📦 Key Angular Concepts Used

| Concept | Where Used |
|---------|------------|
| Standalone Components | All pages |
| Lazy Loading Routes | `app.routes.ts` |
| Reactive Forms | Login, Register, Dashboard modals |
| HTTP Client | AuthService, UserService |
| Route Guards (functional) | authGuard |
| Custom Pipes | AdminCountPipe |
| Angular Signals (none — class-based) | — |
| `ngFor` + `trackBy` | Dashboard table |
| `ngIf` / `*ngIf` | All conditional UI |
| Two-way binding `[(ngModel)]` | Filter inputs |
