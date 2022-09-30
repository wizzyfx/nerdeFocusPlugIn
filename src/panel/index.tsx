import "./index.less";
import React from "react";
import History from "./components/History";
import Toolbar from "./components/Toolbar";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";


const appTheme = chrome.devtools.panels.themeName === "dark" ? "dark" : "light";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.command) {
    case "toggleIndicator":
      store.dispatch({ type: "indicator/toggle" });
      sendResponse({ farewell: "goodbye" });
      break;
    default:
      break;
  }
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div id="wrapper" className={appTheme}>
        <Toolbar />
        <History />
      </div>
    </Provider>
  );
};

createRoot(document.getElementById("nerdeFocus")!).render(<App />);
