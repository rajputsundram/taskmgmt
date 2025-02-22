'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Checkbox = ({ checked, onChange }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    className="h-5 w-5 appearance-none rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-gray-300"
    style={{
      backgroundColor: checked ? '#3F9142' : 'white',
      backgroundImage: checked
        ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'%3E%3Cpath d='M20.285 6.709l-11.01 11.01-5.025-5.025 1.41-1.41 3.615 3.616 9.6-9.601z'/%3E%3C/svg%3E\")"
        : 'none',
      backgroundSize: '70%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  />
);

const Page = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/task', { withCredentials: true });
      if (response.data.success) {
        setTodos(response.data.tasks);
      } else {
        alert(`Failed to fetch tasks: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleCompletion = async (id, currentStatus) => {
    try {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, isCompleted: !currentStatus } : todo
        )
      );

      const response = await axios.put(
        `/api/task/${id}`,
        { isCompleted: !currentStatus },
        { withCredentials: true }
      );

      if (!response.data.success) {
        alert("Failed to update task completion");
      }
    } catch (error) {
      console.error("Error updating task completion:", error);
      alert("Error updating task completion");
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`/api/task/${id}`, { withCredentials: true });

      if (response.data.success) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      } else {
        alert("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 w-full">
      {/* Incomplete Tasks */}
      <div>
        <h1 className="text-xl font-semibold mb-4">Incomplete Tasks</h1>
        <ul className="space-y-3">
          {todos.filter((todo) => !todo.isCompleted).map((todo) => (
            <li key={todo._id} className="flex items-center justify-between p-3 rounded-sm border border-gray-300 bg-white">
              <div className="flex items-center gap-4">
                <Checkbox checked={todo.isCompleted} onChange={() => toggleCompletion(todo._id, todo.isCompleted)} />
                <span className="text-lg">{todo.title}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Completed Tasks */}
      <div className="mt-10">
        <h1 className="text-xl font-semibold mb-4">Completed Tasks</h1>
        <ul className="space-y-3">
          {todos.filter((todo) => todo.isCompleted).map((todo) => (
            <li key={todo._id} className="flex items-center justify-between p-3 rounded-sm border border-gray-300 bg-green-50">
              <div className="flex items-center gap-4">
                <Checkbox checked={todo.isCompleted} onChange={() => toggleCompletion(todo._id, todo.isCompleted)} />
                <span className="text-lg line-through text-gray-500">{todo.title}</span>
              </div>
              <button
                onClick={() => deleteTask(todo._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
