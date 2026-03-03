import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* <div
        className={
          theme === "light" ? "bg-light text-dark" : "bg-dark text-white"
        }
        style={{ minHeight: "100vh", width: "100%" }}
      > */}
      {children}
      {/* </div> */}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
