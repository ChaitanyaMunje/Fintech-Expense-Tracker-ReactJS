import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [showDropdown, setShowDropdown] = useState(false);

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        theme === "dark" ? "navbar-dark bg-dark" : "navbar-dark bg-primary"
      } px-4 shadow-sm`}
    >
      <span className="navbar-brand fw-bold fs-4 text-white">
        Fintech Dashboard
      </span>
      <div className="ms-auto d-flex align-items-center">
        <button className="btn btn-light me-3" onClick={toggleTheme}>
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>

        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {firstLetter}
        </div>

        {showDropdown && (
          <div
            className="position-absolute bg-white p-2 shadow"
            style={{ right: 20, top: 60 }}
          >
            <button className="btn btn-danger btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
