import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTodos = async () => {
    const res = await API.get("/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title) return;

    const res = await API.post("/todos", { title });
    setTodos([res.data, ...todos]);
    setTitle("");
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

  const handleLogout = async () => {
    await API.post("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name}
          </h2>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Add Todo */}
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Add new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition">
            Add
          </button>
        </form>

        {/* Todo List */}
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg"
            >
              <span
                onClick={() =>
                  toggleTodo(todo._id, todo.completed)
                }
                className={`cursor-pointer ${
                  todo.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {todo.title}
              </span>

              <button
                onClick={() => deleteTodo(todo._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;