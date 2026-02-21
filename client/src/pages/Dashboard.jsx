import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | completed | pending

  const fetchTodos = async () => {
    const res = await API.get("/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addOrUpdateTodo = async (e) => {
    e.preventDefault();
    if (!title) return;

    if (editingId) {
      const res = await API.put(`/todos/${editingId}`, {
        title,
        description,
      });

      setTodos(
        todos.map((todo) =>
          todo._id === editingId ? res.data : todo
        )
      );

      setEditingId(null);
    } else {
      const res = await API.post("/todos", {
        title,
        description,
      });

      setTodos([res.data, ...todos]);
    }

    setTitle("");
    setDescription("");
  };

  const editTodo = (todo) => {
    setEditingId(todo._id);
    setTitle(todo.title);
    setDescription(todo.description || "");
  };

  const toggleTodo = async (id, completed) => {
    const res = await API.put(`/todos/${id}`, {
      completed: !completed,
    });

    setTodos(
      todos.map((todo) =>
        todo._id === id ? res.data : todo
      )
    );
  };

  const deleteTodo = async (id) => {
    await API.delete(`/todos/${id}`);
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  // 🔥 FILTER + SEARCH LOGIC
  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        if (filter === "completed") return todo.completed;
        if (filter === "pending") return !todo.completed;
        return true;
      })
      .filter((todo) =>
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        (todo.description &&
          todo.description
            .toLowerCase()
            .includes(search.toLowerCase()))
      );
  }, [todos, filter, search]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Welcome, {user?.name}
          </h2>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        {/* Add / Edit Form */}
        <form onSubmit={addOrUpdateTodo} className="mb-6 space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? "Update Task" : "Add Task"}
          </button>
        </form>

        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        {/* ✅ Filter Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded ${
              filter === "completed"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Completed
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded ${
              filter === "pending"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Pending
          </button>
        </div>

        {/* Todo List */}
        <ul className="space-y-3">
          {filteredTodos.map((todo) => (
            <li
              key={todo._id}
              className="bg-gray-50 p-3 rounded"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3
                    onClick={() =>
                      toggleTodo(todo._id, todo.completed)
                    }
                    className={`font-semibold cursor-pointer ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {todo.title}
                  </h3>

                  {todo.description && (
                    <p className="text-sm text-gray-600">
                      {todo.description}
                    </p>
                  )}
                </div>

                <div className="space-x-2">
                  <button
                    onClick={() => editTodo(todo)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default Dashboard;