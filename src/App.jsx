import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/items"; // Your JSON Server endpoint

const App = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;

    try {
      const response = await axios.post(API_URL, formData);
      setItems([...items, response.data]);
      setFormData({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleEditItem = (item) => {
    setEditingId(item.id);
    setFormData({ name: item.name, description: item.description });
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;

    try {
      const response = await axios.put(`${API_URL}/${editingId}`, formData);
      setItems(
        items.map((item) => (item.id === editingId ? response.data : item))
      );
      setEditingId(null);
      setFormData({ name: "", description: "" });
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRUD App</h1>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={editingId ? handleUpdateItem : handleAddItem}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {editingId ? "Update" : "Add"} Item
        </button>
      </form>

      <div className="flex flex-col">
        <h2 className="text-xl font-bold mb-2">Items</h2>
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded px-4 py-2 mb-2 flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{item.name}</p>
              <p>{item.description}</p>
            </div>
            <div>
              <button
                onClick={() => handleEditItem(item)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
