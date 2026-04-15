# AdminSmartMealPrep - Admin Panel

A modern React-based admin panel for managing recipes in the SmartMealPrep meal preparation system. Built with Vite, Material-UI, and React Router for a fast and responsive user experience.

## Features

- **Authentication System**: Secure login with protected routes
- **Recipe Management**:
  - View all recipes in a responsive grid layout
  - Create new recipes with detailed information
  - Edit existing recipes
  - Delete recipes
- **Modern UI**: Material-UI components with custom styling
- **Responsive Design**: Optimized for desktop and mobile devices
- **Fast Development**: Vite-powered build system with hot module replacement

## Tech Stack

- **Frontend**: React 19 with hooks
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) with Emotion styling
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Linting**: ESLint with React-specific rules

## Project Structure

```
src/
├── api/
│   └── axiosClient.js          # HTTP client configuration
├── assets/                     # Static assets
├── auth/
│   └── AuthContext.jsx         # Authentication context
├── components/
│   └── ProtectedRoute.jsx      # Route protection component
├── pages/
│   ├── Login.jsx               # Login page
│   ├── Recipes.jsx             # Recipe list page
│   ├── CreateRecipe.jsx        # Recipe creation page
│   └── EditRecipe.jsx          # Recipe editing page
├── services/
│   └── recipeService.js        # Recipe API service
├── styles/
│   ├── RecipeList.css          # Recipe list styling
│   ├── CreateRecipe.css        # Recipe creation styling
│   └── Login.css               # Login page styling
├── App.jsx                     # Main app component
├── main.jsx                    # App entry point
└── index.css                   # Global styles
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd admin-panel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## API Integration

The application connects to a backend API for recipe management. Configure the API base URL in `src/api/axiosClient.js`.

## Authentication

The app uses a context-based authentication system. Login credentials are managed through the AuthContext, and protected routes ensure only authenticated users can access admin features.

## License

This project is part of the SmartMealPrep system. See project license for details.
