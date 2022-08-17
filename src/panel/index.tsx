import React from "react";
import { render } from "react-dom";
import "./index.less";
import Toolbar from "./Toolbar";

const appTheme = chrome.devtools.panels.themeName === "dark" ? "dark" : "light";

const App: React.FC = () => {
  return (
    <main className={appTheme}>
      <Toolbar />
    </main>
  );
};

render(<App />, document.getElementById("nerdeFocus"));
