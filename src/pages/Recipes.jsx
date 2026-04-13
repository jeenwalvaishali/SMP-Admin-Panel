import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecipes, deleteRecipe } from "../services/recipeService";
import "../styles/RecipeList.css";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  // Fetch Recipes
  const fetchRecipes = async () => {
    try {
      const res = await getRecipes();

      console.log("FULL RESPONSE:", res);
      console.log("DATA:", res.data);

      // ✅ HANDLE ALL POSSIBLE BACKEND FORMATS
      const data = res.data;

      if (Array.isArray(data)) {
        setRecipes(data);
      } else if (data.recipes) {
        setRecipes(data.recipes);
      } else if (data.data) {
        setRecipes(data.data);
      } else {
        console.warn("Unknown response format");
        setRecipes([]);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  //Delete Recipe
  const handleDelete = async () => {
    const id = recipeToDelete;
    if (!id) return;

    try {
      setDeletingId(id);
      setRecipeToDelete(null); // Close the popup immediately
      setMessage({ type: "", text: "" });

      await deleteRecipe(id);

      setMessage({
        type: "success",
        text: "Recipe deleted successfully! ✓",
      });

      setTimeout(() => {
        fetchRecipes();
        setMessage({ type: "", text: "" });
      }, 1500);
    } catch (error) {
      console.error("Delete failed:", error);
      const errorText =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete recipe. Please try again.";

      setMessage({ type: "error", text: errorText });
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 4000);
    } finally {
      setDeletingId(null);
    }
  };

  // Logout Function
  const handleLogout = () => {
    // 1. Clear your auth data (adjust based on where you store it)
    localStorage.removeItem("token");
    sessionStorage.clear();

    // 2. Redirect to the login page
    navigate("/login");
  };

  if (loading) return <h3>Loading...</h3>;

  //Recipe List UI
  return (
    <div className="container">
      {/* MESSAGE ALERT */}
      {message.text && (
        <div className={`message-alert message-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* HEADER */}
      <div className="header">
        <h2>Recipes</h2>
        <div className="header-actions">
          <button className="primary-btn" onClick={() => navigate("/create")}>
            + Create Recipe
          </button>
          {/* NEW LOGOUT BUTTON */}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid">
        {recipes.map((r) => (
          <div key={r._id} className="card">
            {/* IMAGE */}
            {r.imageUrl && (
              <img
                src={r.imageUrl || "/placeholder.png"}
                alt={r.title}
                className="card-img"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
            )}

            {/* CONTENT */}
            <div className="card-body">
              <h4 className="title">{r.title}</h4>

              <div className="actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit/${r._id}`)}
                  disabled={deletingId === r._id}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => setRecipeToDelete(r._id)}
                  disabled={deletingId === r._id}
                >
                  {deletingId === r._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {recipeToDelete && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-icon">ⓘ</div>
            <h2 className="modal-title">Delete this recipe?</h2>
            <p className="modal-subtitle">You won't be able to return to this response</p>
            
            <div className="modal-actions">
              <button className="btn-confirm" onClick={handleDelete}>
                Delete
              </button>
              <button className="btn-cancel" onClick={() => setRecipeToDelete(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
