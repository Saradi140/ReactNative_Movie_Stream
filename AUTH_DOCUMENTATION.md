# StreamBox Authentication System

## Overview
This document describes the complete user authentication system implemented in the StreamBox application, which includes registration, login, validation, and secure state management.

## Architecture

### Components

#### 1. **Redux Auth Slice** (`src/redux/authSlice.ts`)
- Manages authentication state in Redux
- Stores: `username`, `isLoggedIn`, `loading`, `error`
- Actions:
  - `loginSuccess(username)` - Sets user as logged in
  - `logout()` - Clears authentication state
  - `setLoading(boolean)` - Loading state
  - `setError(error)` - Error management
  - `setUsername(username)` - Updates username

#### 2. **Redux Store** (`src/redux/store.ts`)
- Combines movies and auth reducers
- Exports `RootState` and `AppDispatch` types for TypeScript support

#### 3. **Validation Schemas** (`src/utils/validationSchemas.ts`)
Uses **Yup** for robust form validation:

**Login Schema:**
- Username: 3-20 chars, alphanumeric + underscores
- Password: minimum 6 characters

**Registration Schema:**
- Username: 3-20 chars, alphanumeric + underscores
- Email: valid email format
- Password: min 6 chars, requires uppercase, lowercase, and numbers
- Confirm Password: must match password field

#### 4. **Auth Persistence Hook** (`src/hooks/useAuthPersist.ts`)
- Automatically loads authentication state from AsyncStorage on app startup
- Syncs with Redux store
- Handles errors gracefully

#### 5. **Login Screen** (`app/login.tsx`)
Features:
- Form validation with real-time error display
- Password visibility toggle
- Demo login button for quick testing
- Loading states and animations
- Redux dispatch on successful login
- AsyncStorage persistence

#### 6. **Registration Screen** (`app/register.tsx`)
Features:
- Complete form validation
- Password strength validation
- Password confirmation matching
- Back button for navigation
- Error handling and user feedback

#### 7. **Root Layout** (`app/_layout.tsx`)
- Navigation logic based on authentication state
- Automatic redirect to login/home based on session
- Integration with auth persistence hook

#### 8. **Tabs Layout** (`app/(tabs)/_layout.tsx`)
- Display logged-in username in header
- Logout button in header
- Confirmation dialog for logout

## Security Best Practices Implemented

### 1. **AsyncStorage Security**
- User credentials stored only after validation
- Logout clears all auth data immediately
- No sensitive data (passwords) stored - only username and login status

### 2. **Form Validation**
- Client-side validation before submission
- Password complexity requirements
- Email format validation
- Username format restrictions

### 3. **State Management**
- Redux for centralized state
- Separation of concerns (UI, validation, storage)
- Type-safe with TypeScript

### 4. **User Experience**
- Loading states prevent multiple submissions
- Clear error messages guide users
- Demo credentials for easy testing
- Password visibility toggle for convenience

## Usage Flow

### Login Flow
1. User enters username and password
2. Form validates against `loginSchema`
3. On validation success, displays loading indicator
4. Stores user info in AsyncStorage
5. Dispatches `loginSuccess` action to Redux
6. Navigates to home screen `/(tabs)`

### Registration Flow
1. User fills registration form
2. Real-time validation against `registrationSchema`
3. On submission:
   - Validates all fields
   - Stores user data in AsyncStorage
   - Dispatches login action
   - Navigates to home screen

### Logout Flow
1. User taps logout button in header
2. Shows confirmation dialog
3. Clears AsyncStorage
4. Dispatches `logout` action
5. Navigates to login screen

## Data Storage

### AsyncStorage Keys
- `username` - Currently logged-in user's username
- `email` - User's email (registration only)
- `isLoggedIn` - Boolean flag for session

### Redux State Structure
```typescript
{
  auth: {
    username: string | null,
    isLoggedIn: boolean,
    loading: boolean,
    error: string | null,
  }
}
```

## Demo Credentials
For quick testing:
- **Username:** demo_user
- **Password:** 123456

## Installation & Dependencies

### Required Packages
```bash
npm install yup
npm install @react-native-async-storage/async-storage
npm install @reduxjs/toolkit react-redux
```

All dependencies are already in `package.json`.

## File Structure
```
app/
  ├── login.tsx          # Login screen with validation
  ├── register.tsx       # Registration screen
  ├── _layout.tsx        # Root layout with auth routing
  └── (tabs)/
      └── _layout.tsx    # Tab layout with user header

src/
  ├── redux/
  │   ├── authSlice.ts   # Auth state management
  │   └── store.ts       # Redux store configuration
  ├── hooks/
  │   └── useAuthPersist.ts  # Auth persistence hook
  ├── utils/
  │   └── validationSchemas.ts  # Yup validation schemas
  └── styles/
      └── theme.ts       # Color and spacing constants
```

## Future Enhancements

1. **API Integration**
   - Connect to backend authentication service
   - Implement JWT token handling

2. **Password Recovery**
   - Email-based password reset
   - Security questions

3. **Advanced Security**
   - Biometric authentication
   - Two-factor authentication

4. **Social Login**
   - Google OAuth
   - Apple SignIn

## Testing

### Manual Testing Checklist
- [ ] Login with demo credentials
- [ ] Login validation errors appear
- [ ] Password toggle works
- [ ] Demo button quick-logs user in
- [ ] User name appears in header after login
- [ ] Logout works and clears data
- [ ] App remembers login after restart
- [ ] Registration validation works
- [ ] Navigate between login and register

### Error Scenarios
- Invalid credentials format
- Missing required fields
- Password mismatch on registration
- Network errors (future)
