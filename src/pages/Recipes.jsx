import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecipes, deleteRecipe } from "../services/recipeService";
import "../styles/RecipeList.css";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    try {
      await deleteRecipe(id);
      fetchRecipes();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <h2>Recipes</h2>
        <button className="primary-btn" onClick={() => navigate("/create")}>
          + Create Recipe
        </button>
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
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(r._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

//     return (
//     <div style={{ padding: 20 }}>
//       <h2>Recipes</h2>

//       <button onClick={() => navigate("/create")}>
//         ➕ Create Recipe
//       </button>

//       <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
//         {recipes.map((r) => (
//           <div
//             key={r._id}
//             style={{
//               border: "1px solid #ddd",
//               padding: 10,
//               width: 220,
//               borderRadius: 10,
//             }}
//           >
//             <h4>{r.title}</h4>

//             {r.imageUrl && (
//               <img
//                 src={r.imageUrl}
//                 alt=""
//                 style={{ width: "100%", borderRadius: 8 }}
//               />
//             )}

//             <div style={{ display: "flex", gap: 10 }}>
//               <button onClick={() => navigate(`/edit/${r._id}`)}>
//                 ✏️ Edit
//               </button>

//               <button onClick={() => handleDelete(r._id)}>
//                 ❌ Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
