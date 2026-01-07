# Library Management System

A modern library management application built with React, TypeScript, and Vite, following TDD principles and clean code practices.

## 🏗️ Architecture & Design Decisions

### Core Principles

- **Test-Driven Development (TDD)**: All features are developed test-first
- **SOLID Principles**: Clean separation of concerns and single responsibility
- **DRY (Don't Repeat Yourself)**: Reusable components and utilities
- **KISS (Keep It Simple, Stupid)**: Simple, maintainable solutions

### Architecture Overview

```
src/
├── domain/           # Core business logic (domain models)
│   ├── models/       # Book, User, Library entities
│   └── services/     # Business logic services
├── infrastructure/   # External concerns (API, auth, storage)
│   ├── api/          # Mocked backend service
│   ├── auth/         # Authentication providers
│   └── storage/      # Local storage management
├── application/      # Application layer (use cases)
│   └── useCases/     # Business use cases
├── presentation/     # UI layer
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   └── pages/        # Page components
└── test/             # Test utilities and setup
```

### Key Design Decisions

#### 1. **Domain-Driven Design (DDD)**

- **Domain Models**: `Book`, `User`, `Library` are pure TypeScript classes with business logic
- **Value Objects**: Immutable objects like `BookCopy` to represent book instances
- **Services**: Domain services handle complex business rules (e.g., borrowing limits)

#### 2. **Separation of Concerns**

- **Domain Layer**: Pure business logic, no framework dependencies
- **Infrastructure Layer**: External integrations (API, auth, storage)
- **Presentation Layer**: React components, only concerned with UI

#### 3. **State Management**

- **React Context + Hooks**: For global state (library, user session)
- **Local State**: Component-level state for UI interactions
- **Rationale**: Avoids over-engineering with Redux for this scope

#### 4. **Authentication Strategy**

- **OAuth 2.0**: Google/GitHub authentication
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access Control (RBAC)**: User vs Admin roles
- **Mock Implementation**: Simulated auth for development/testing

#### 5. **Backend Mocking**

- **In-Memory Store**: Simulates database with localStorage persistence
- **API Service Layer**: Mimics REST API with async operations
- **Realistic Delays**: Simulates network latency for better UX testing

#### 6. **Error Handling**

- **Custom Error Classes**: Domain-specific errors (e.g., `BorrowLimitExceededError`)
- **Error Boundaries**: React error boundaries for graceful UI failures
- **HTTP Status Codes**: Proper 400, 401, 403 handling

### Business Rules Implementation

#### Book Borrowing Rules

1. **User Borrowing Limit**: Maximum 2 books per user
2. **Copy Limit**: Only 1 copy of the same book per user
3. **Stock Management**: Never show negative stock
4. **Availability**: Clear indicators when books are unavailable

#### Admin Capabilities

- Add new books to the library
- Update book stock/copies
- View all borrowed books and users
- Track borrowing history
- All user functionalities included

### Testing Strategy

#### Unit Tests

- Domain models and business logic
- Services and use cases
- Utility functions

#### Integration Tests

- Component interactions
- API service integration
- Auth flow

#### Component Tests

- React components with React Testing Library
- User interactions and accessibility

### Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Testing**: Vitest 4
- **Styling**: Modern CSS3 (responsive design)
- **Auth**: Mock OAuth 2.0 (Google, GitHub)
- **State**: React Context API
- **Persistence**: LocalStorage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

**Current Test Results:**

- ✅ 37 tests passing
- ✅ Book model: 11 tests
- ✅ User model: 11 tests
- ✅ Library model: 15 tests

### Build

```bash
npm run build
```

## 🎮 Using the Application

### Login

1. Open the app at `http://localhost:5173`
2. Enter any email address
3. Choose user type:
   - **Regular User**: Uncheck "Login as Admin"
   - **Admin User**: Check "Login as Admin"
4. Click "Sign in with Google" or "Sign in with GitHub"

### As a Regular User

1. **Browse Books**: View all available books with stock information
2. **Borrow Books**: Click "Borrow" on any available book (max 2 books total)
3. **View Borrowed Books**: See your borrowed books at the top of the page
4. **Return Books**: Click "Return" on any borrowed book

### As an Admin

All user features plus:

1. **Add New Books**: Fill out the form to add books to the library
2. **Update Stock**: Modify the number of available copies
3. **View Inventory**: See complete inventory with borrowing statistics

## 📝 User Stories Implementation

### Story 1: View Books ✅

Users can view all available books in the library, with empty state handling.

**Implementation:**

- BookList component displays all books with stock information
- Empty state message when no books available
- Real-time stock updates

### Story 2: Borrow Books ✅

Users can borrow books with a 2-book limit enforced.

**Implementation:**

- User.canBorrow() validates 2-book limit
- Library.borrowBook() enforces business rules
- Clear error messages when limit exceeded
- Disabled borrow button when limit reached

### Story 3: Borrow Book Copies ✅

Multiple copies are handled correctly, with 1 copy per book per user limit.

**Implementation:**

- User.hasBorrowedBook() checks for duplicate borrows
- Book.availableCopies tracks remaining stock
- Visual stock indicators (green for available, red for low stock)
- Prevents borrowing same book twice

### Story 4: Return Books ✅

Users can return books, updating both borrowed list and library stock.

**Implementation:**

- BorrowedBooks component shows user's borrowed books
- Library.returnBook() updates stock and user's list
- Real-time UI updates via LibraryContext
- LocalStorage persistence of all changes

## 🔐 Security Considerations

- Token validation on every request
- Role-based access control
- Stock manipulation prevention
- Input validation and sanitization
- XSS protection

## 📊 Assumptions

1. **User Identity**: Users are identified by email from OAuth provider
2. **Book Uniqueness**: Books are identified by ISBN
3. **Persistence**: Data persists in localStorage (simulating backend)
4. **Concurrent Users**: No real-time sync (single-user session focus)
5. **Book Copies**: Copies are fungible (any copy can be borrowed/returned)

## 🎯 Future Enhancements

- Real backend integration
- Book search and filtering
- Due dates and late fees
- Book reservations
- Reading history
- Book recommendations

## 📄 License

Private - Not for public distribution
