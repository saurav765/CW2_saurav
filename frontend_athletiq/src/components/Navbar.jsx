import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-indigo-700 text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">AthletiQ</div>
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/add-member" className="hover:underline">
          Add Member
        </Link>
        <Link to="/" className="hover:underline">
          Logout
        </Link>
      </div>
    </nav>
  );
}
