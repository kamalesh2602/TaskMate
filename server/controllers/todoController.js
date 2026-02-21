const Todo = require("../models/Todo");

// Create Todo
exports.createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title)
      return res.status(400).json({ message: "Title is required" });

    const todo = await Todo.create({
      user: req.user._id,
      title,
      description,
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Todo
exports.updateTodo = async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo)
      return res.status(404).json({ message: "Todo not found" });

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    const updated = await todo.save();

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Todo
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo)
      return res.status(404).json({ message: "Todo not found" });

    res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};