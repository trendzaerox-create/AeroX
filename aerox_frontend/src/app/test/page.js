"use client";

import { useState } from "react";

export default function TestComponent() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 flex flex-col items-center justify-center gap-4 bg-[#f5f5f5] rounded-xl shadow-md">
      
      <h2 className="text-xl font-semibold text-gray-800">
        Test Component Working ✅
      </h2>

      <p className="text-gray-600">
        Button clicked: <span className="font-bold">{count}</span> times
      </p>

      <button
        onClick={() => setCount(count + 1)}
        className="px-5 py-2 rounded-full bg-black text-white text-sm tracking-wide hover:scale-105 transition duration-300"
      >
        Click Me
      </button>

    </div>
  );
}