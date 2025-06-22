"use client";

import { useState } from "react";

const options = ["Áo thun", "Áo sơ mi", "Áo khoác"];

export default function CustomSelect() {
  const [selected, setSelected] = useState("Chọn loại áo");
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full max-w-xs">
      <button
        onClick={() => setOpen(!open)}
        className="btn w-full justify-between"
      >
        {selected}
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-10 mt-2 w-full bg-base-100 shadow rounded-box">
          {options.map((option) => (
            <li key={option}>
              <button
                onClick={() => {
                  setSelected(option);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-base-200"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
