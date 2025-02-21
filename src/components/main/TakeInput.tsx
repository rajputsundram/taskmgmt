"use client";
import React, { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { CiCalendar, CiRepeat } from "react-icons/ci";
import axios from "axios";
import { useAuth } from "../../context/Authcontext"; // Use token from context
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TakeInput = () => {
  const [credentials, setCredentials] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.title.trim() || !credentials.description.trim()) {
      toast.error("Both title and description are required!");
      return;
    }
    
    if (!token) {
      toast.error("Authentication error! Please log in again.");
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(
        "/api/task",
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // ✅ Ensures cookies are sent
        }
      );

      if (response.data.success) {
        toast.success("✅ Task added successfully!");
        setCredentials({ title: "", description: "" });
      } else {
        toast.error("❌ Error adding task. Please try again.");
      }
    } catch (error) {
      toast.error("🚨 An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full px-4 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-[rgb(239,246,239)] rounded-lg min-h-[200px] p-6 border border-gray-300"
      >
        <input
          onChange={handleChange}
          value={credentials.title}
          name="title"
          type="text"
          placeholder="Add your task..."
          className="w-full h-[50px] px-4 rounded-lg bg-white text-gray-700 placeholder-gray-400 outline-none border border-gray-300 text-lg"
        />
        <textarea
          onChange={handleChange}
          value={credentials.description}
          name="description"
          placeholder="Add a description..."
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-white text-gray-700 placeholder-gray-400 outline-none border border-gray-300 text-lg mt-2 resize-none"
        />
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-4 text-2xl text-gray-600">
            <FaRegBell />
            <CiRepeat />
            <CiCalendar />
          </div>
          <button
            type="submit"
            className={`px-6 py-3 rounded-md text-white bg-[#3F9142] hover:bg-[#2d6d2f] text-lg transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "ADD TASK"}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default TakeInput;
