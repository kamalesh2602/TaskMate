import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTodos = async () => {
    try {
      const res = await API.get("/todos");
      setTodos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      const res = await API.post("/todos", { title });
      setTodos([res.data, ...todos]);
      setTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await API.put(`/todos/${id}`, {
        completed: !completed,
      });

      setTodos(
        todos.map((todo) =>
          todo._id === id ? res.data : todo
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Welcome {user?.name}</h2>

      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Add new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <span
              onClick={() =>
                toggleTodo(todo._id, todo.completed)
              }
              style={{
                textDecoration: todo.completed
                  ? "line-through"
                  : "none",
                cursor: "pointer",
              }}
            >
              {todo.title}
            </span>

            <button onClick={() => deleteTodo(todo._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;