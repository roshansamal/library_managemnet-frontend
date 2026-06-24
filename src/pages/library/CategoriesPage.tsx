import { useEffect, useState } from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/libraryCategories.service";

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setCategoryName("");
  };

  const handleAdd = async () => {
    try {
      await createCategory({
        category_name: categoryName,
      });

      resetForm();
      loadCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.category_id);
    setCategoryName(category.category_name);
  };

  const handleUpdate = async () => {
    try {
      if (!editingId) return;

      await updateCategory(editingId, {
        category_name: categoryName,
      });

      resetForm();
      loadCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Delete this category?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCategory(id);
      loadCategories();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Library Categories</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) =>
            setCategoryName(e.target.value)
          }
        />

        <button
          onClick={
            editingId ? handleUpdate : handleAdd
          }
        >
          {editingId
            ? "Update Category"
            : "Add Category"}
        </button>

        {editingId && (
          <button onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      <table
        border={1}
        cellPadding={10}
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.category_id}>
              <td>{category.category_id}</td>

              <td>{category.category_name}</td>

              <td>
                <button
                  onClick={() =>
                    handleEdit(category)
                  }
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      category.category_id
                    )
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}