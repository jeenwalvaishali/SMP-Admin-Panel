import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Recipes from "./pages/Recipes";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Recipes />} />
        <Route path="/create" element={<CreateRecipe />} />
        <Route path="/edit/:id" element={<EditRecipe />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Recipes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}