import "./index.less";
import React from "react";
import Toolbar from "./components/Toolbar";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";

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
