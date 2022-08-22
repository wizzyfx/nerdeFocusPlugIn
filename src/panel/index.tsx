import React from "react";
import { render } from "react-dom";
import "./index.less";
import Toolbar from "./components/Toolbar";

const appTheme = chrome.devtools.panels.themeName === "dark" ? "dark" : "light";

const App: React.FC = () => {
  return (
    <div id="wrapper" className={appTheme}>
      <Toolbar />
    </div>
  );
};

render(<App />, document.getElementById("nerdeFocus"));
