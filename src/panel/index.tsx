import React from "react";
import { render } from "react-dom";
import "./index.less";
import Toolbar from "./Toolbar";

const App: React.FC = () => {
  return (
    <div>
      <Toolbar />
    </div>
  );
};

render(<App />, document.getElementById("nerdeFocus"));
