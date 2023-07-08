import darkModeStyles from "../styles/darkMode.module.css";
import { useEffect, useState } from "react";

const DarkMode = () => {
  const [selectedTheme, setSelectedTheme] = useState("light");

  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
    localStorage.setItem("selectedTheme", "dark");
    setSelectedTheme("dark");
  };

  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
    localStorage.setItem("selectedTheme", "light");
    setSelectedTheme("light");
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("selectedTheme");
    if (storedTheme) {
      setSelectedTheme(storedTheme);
      if (storedTheme === "dark") {
        setDarkMode();
      } else {
        setLightMode();
      }
    }
  }, []);

  const toggleTheme = (e) => {
    if (e.target.checked) setDarkMode();
    else setLightMode();
  };

  return (
    <div
      className={`row mt-1 me-2 justify-content-end ${darkModeStyles.dark_mode}`}
    >
      <input
        className={darkModeStyles.dark_mode_input}
        type="checkbox"
        id="darkmode-toggle"
        onChange={toggleTheme}
        checked={selectedTheme === "dark"}
      />
      <label className={darkModeStyles.dark_mode_label} htmlFor="darkmode-toggle"></label>
    </div>
  );
};

export default DarkMode;
