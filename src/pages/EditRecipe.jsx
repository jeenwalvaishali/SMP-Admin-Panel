import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRecipe,
  getRecipes,
  updateRecipe,
  uploadImage,
} from "../services/recipeService";
import "../styles/CreateRecipe.css";


export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    cuisine: "",
    prepTime: "",
    imageUrl: "",
    imagePublicId: "",
    ingredients: [""],
    steps: [""],
  });

  const extractRecipe = (data) => {
    if (!data) return null;
    if (Array.isArray(data)) return data[0] || null;
    if (data.recipe) return data.recipe;
    if (data.data) {
      if (Array.isArray(data.data)) return data.data[0] || null;
      if (data.data.recipe) return data.data.recipe;
      return data.data;
    }
    return data;
  };

  const findRecipeById = (items) => {
    if (!items) return null;
    const list = Array.isArray(items)
      ? items
      : items.recipes || items.data || [];

    if (!Array.isArray(list)) return null;

    return list.find(
      (r) => r._id == id || r.id == id || r._id == `${id}` || r.id == `${id}`
    );
  };

  const normalizeRecipe = (recipe) => ({
    title: recipe?.title ?? "",
    description: recipe?.description ?? "",
    cuisine: recipe?.cuisine ?? "",
    prepTime: recipe?.prepTime ?? "",
    imageUrl: recipe?.imageUrl ?? "",
    imagePublicId: recipe?.imagePublicId ?? "",
    ingredients:
      Array.isArray(recipe?.ingredients) && recipe.ingredients.length
        ? recipe.ingredients
        : [""],
    steps:
      Array.isArray(recipe?.steps) && recipe.steps.length
        ? recipe.steps
        : [""],
  });

  // ---------------- FETCH RECIPE ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let recipe = null;

        try {
          const res = await getRecipe(id);
          recipe = extractRecipe(res.data);
        } catch (err) {
          const listRes = await getRecipes();
          recipe = findRecipeById(listRes.data);
        }

        if (recipe) {
          setForm(normalizeRecipe(recipe));
        } else {
          console.warn("Recipe not found for edit id:", id);
        }
      } catch (err) {
        console.error("Failed to load recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  // ---------------- IMAGE UPLOAD ----------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert("File is too large. Please upload an image smaller than 5MB.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);

      const res = await uploadImage(formData);

      setForm((prev) => ({
        ...prev,
        imageUrl: res.data.imageUrl,
        imagePublicId: res.data.imagePublicId,
      }));
    } catch (err) {
            const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        err.message ||
        "Image upload failed.";

      console.log("UPLOAD ERROR:", message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DRAG & DROP ----------------
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // ---------------- ARRAY HANDLERS ----------------
  const handleArrayChange = (type, index, value) => {
    const updated = [...form[type]];
    updated[index] = value;
    setForm({ ...form, [type]: updated });
  };

  const addField = (type) => {
    setForm({ ...form, [type]: [...form[type], ""] });
  };

  const removeField = (type, index) => {
    const updated = form[type].filter((_, i) => i !== index);
    setForm({ ...form, [type]: updated });
  };

  // ---------------- UPDATE ----------------
  const handleUpdate = async () => {
    try {
      setLoading(true);

      await updateRecipe(id, {
        ...form,
        prepTime: Number(form.prepTime),
        ingredients: form.ingredients.filter(Boolean),
        steps: form.steps.filter(Boolean),
      });

      navigate("/");
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="card">
        <h2 className="title">✏️ Edit Recipe</h2>

        {/* BASIC INFO */}
        <div className="section">
          <input
            className="input"
            value={form.title}
            placeholder="Recipe Title"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            className="textarea"
            value={form.description}
            placeholder="Description"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="row">
            <input
              className="input"
              value={form.cuisine}
              placeholder="Cuisine"
              onChange={(e) =>
                setForm({ ...form, cuisine: e.target.value })
              }
            />

            <input
              className="input"
              type="number"
              value={form.prepTime}
              placeholder="Prep Time (mins)"
              onChange={(e) =>
                setForm({ ...form, prepTime: e.target.value })
              }
            />
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="section">
          <label className="label">Recipe Image</label>

          <div
            className="upload-box"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() =>
              document.getElementById("fileInput").click()
            }
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />

            {!form.imageUrl ? (
              <div className="upload-placeholder">
                <p>📤 Drag & Drop or Click to Upload</p>
                <span>PNG, JPG, JPEG up to 5MB</span>
              </div>
            ) : (
              <div className="preview-wrapper">
                <img src={form.imageUrl} alt="preview" />
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setForm({
                      ...form,
                      imageUrl: "",
                      imagePublicId: "",
                    });
                  }}
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* INGREDIENTS */}
        <div className="section">
          <div className="section-header">
            <h3>🥕 Ingredients</h3>
            <button
              className="add-btn"
              onClick={() => addField("ingredients")}
            >
              + Add
            </button>
          </div>

          {form.ingredients.map((item, idx) => (
            <div className="list-item" key={idx}>
              <input
                className="input"
                value={item}
                placeholder="Ingredient"
                onChange={(e) =>
                  handleArrayChange(
                    "ingredients",
                    idx,
                    e.target.value
                  )
                }
              />
              <button
                className="delete-btn"
                onClick={() => removeField("ingredients", idx)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* STEPS */}
        <div className="section">
          <div className="section-header">
            <h3>👨‍🍳 Steps</h3>
            <button
              className="add-btn"
              onClick={() => addField("steps")}
            >
              + Add
            </button>
          </div>

          {form.steps.map((item, idx) => (
            <div className="list-item" key={idx}>
              <textarea
                className="textarea"
                value={item}
                placeholder={`Step ${idx + 1}`}
                onChange={(e) =>
                  handleArrayChange("steps", idx, e.target.value)
                }
              />
              <button
                className="delete-btn"
                onClick={() => removeField("steps", idx)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* SUBMIT */}
        <button
          className="submit-btn"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating Recipe..." : "💾 Update Recipe"}
        </button>
      </div>
    </div>
  );
}

