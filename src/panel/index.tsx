import React from "react";
import { render } from "react-dom";
import "./index.less";
import Toolbar from "./Toolbar";
import { ThemeProvider } from "./context/ThemeContext";

const appTheme = chrome.devtools.panels.themeName === "dark" ? "dark" : "light";

const App: React.FC = () => {
  return (
    <ThemeProvider value={appTheme}>
      <main className={appTheme}>
        <Toolbar />
      </main>
    </ThemeProvider>
  );
};

render(<App />, document.getElementById("nerdeFocus"));
