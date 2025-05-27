"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/register", {
        name,
        email,
        password,
      });

      if (res.status === 201) {
        router.push("/signin");
      }
    } catch (err) {
      const message = err.response?.data?.error || "Something went wrong";
      setError(message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        className="w-full max-w-md rounded border-t-4 border-green-700 bg-white p-6 text-black shadow-md"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="p-2 mb-4 bg-red-500 text-white text-center rounded">
            {error}
          </div>
        )}

        <h2 className="mb-6 text-center text-2xl font-bold">
          Enter the details
        </h2>

        <div className="flex flex-col space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 border border-gray-300 rounded-md px-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Name"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 border border-gray-300 rounded-md px-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Email"
            type="email"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 border border-gray-300 rounded-md px-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Password"
            type="password"
            required
          />
          <button
            type="submit"
            className="mt-4 w-full px-4 py-2 bg-green-700 font-bold text-lg text-white rounded hover:bg-green-800 transition-colors"
          >
            Register
          </button>
          <div className="flex space-x-2 justify-end text-sm mt-2">
            <div>Already have an account?</div>
            <a className="underline text-green-700 hover:text-green-900" href="/signin">
              Login
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
