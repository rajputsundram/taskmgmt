'use client';
import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from "react-icons/fa6";
import axios from 'axios';

const Page = () => {
  const [todos, setTodos] = useState([]); // Initially empty, will be loaded from the API
  const [loading, setLoading] = useState(false); // Track loading state for better UI feedback

  // Function to fetch tasks from the API using Axios
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No token found. Please login first.");
        setLoading(false);
        return;
      }

      const response = await axios.get("/api/task", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setTodos(response.data.tasks);
      } else {
        alert("Failed to fetch tasks", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Optimistic update for task completion
  const toggleCompletion = async (id, currentStatus) => {
    try {
      // Optimistically update the local state
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, isCompleted: !currentStatus } : todo
        )
      );

      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No token found. Please login first.");
        return;
      }

      const response = await axios.put(`/api/tasks/${id}`, {
        isCompleted: !currentStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        alert("Failed to update task completion");
      }
    } catch (error) {
      console.error("Error updating task completion:", error);
      alert("Error updating task completion");
    }
  };

  // Toggle task importance
  const toggleImportance = async (id) => {
    try {
      // Optimistically update the local state
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, isImportant: !todo.isImportant } : todo
        )
      );

      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No token found. Please login first.");
        return;
      }

      const response = await axios.put(`/api/tasks/${id}`, {
        isImportant: !todo.isImportant, // Send the importance toggle to the server
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        alert("Failed to update task importance");
      }
    } catch (error) {
      console.error("Error updating task importance:", error);
      alert("Error updating task importance");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 w-full">
      {/* Incomplete Tasks */}
      <div>
        <h1 className="text-xl font-semibold mb-4">Incomplete Tasks</h1>
        <ul className="space-y-3">
          {todos
            .filter((todo) => !todo.isCompleted)
            .map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-3 rounded-sm border border-gray-300 bg-white"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => toggleCompletion(todo.id, todo.isCompleted)}
                    className="h-5 w-5 appearance-none rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-gray-300"
                    style={{
                      backgroundColor: todo.isCompleted ? 'green' : 'white',
                      backgroundImage: todo.isCompleted
                        ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'black\'%3E%3Cpath d=\'M20.285 6.709l-11.01 11.01-5.025-5.025 1.41-1.41 3.615 3.616 9.6-9.601z\'/%3E%3C/svg%3E")'
                        : 'none',
                      backgroundSize: '70%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                  <span className="text-lg">{todo.task}</span>
                </div>
                <span
                  className="text-2xl cursor-pointer"
                  onClick={() => toggleImportance(todo.id)}
                >
                  {todo.isImportant ? <FaStar /> : <FaRegStar />}
                </span>
              </li>
            ))}
        </ul>
      </div>

      {/* Completed Tasks */}
      <div className="mt-10">
        <h1 className="text-xl font-semibold mb-4">Completed Tasks</h1>
        <ul className="space-y-3">
          {todos
            .filter((todo) => todo.isCompleted)
            .map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-3 rounded-sm border border-gray-300 bg-green-50"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => toggleCompletion(todo.id, todo.isCompleted)}
                    className="h-5 w-5 appearance-none rounded-md border-2 border-gray-300 checked:bg-[#3F9142] checked:border-[#3F9142] checked:focus:ring-2 checked:focus:ring-green-300"
                    style={{
                      backgroundColor: todo.isCompleted ? '#3F9142' : 'white',
                      backgroundImage: todo.isCompleted
                        ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'black\'%3E%3Cpath d=\'M20.285 6.709l-11.01 11.01-5.025-5.025 1.41-1.41 3.615 3.616 9.6-9.601z\'/%3E%3C/svg%3E")'
                        : 'none',
                      backgroundSize: '70%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                  <span className="text-lg line-through text-gray-500">
                    {todo.task}
                  </span>
                </div>
                <span
                  className="text-2xl cursor-pointer"
                  onClick={() => toggleImportance(todo.id)}
                >
                  {todo.isImportant ? <FaStar /> : <FaRegStar />}
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
