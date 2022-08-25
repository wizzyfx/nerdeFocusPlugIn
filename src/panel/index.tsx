import React from "react";
import { createRoot } from "react-dom/client";
import "./index.less";
import Toolbar from "./components/Toolbar";
import { store } from "./store/store";
import { Provider } from "react-redux";

const appTheme = chrome.devtools.panels.themeName === "dark" ? "dark" : "light";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div id="wrapper" className={appTheme}>
        <Toolbar />
      </div>
    </Provider>
  );
};

createRoot(document.getElementById("nerdeFocus")!).render(<App />);
