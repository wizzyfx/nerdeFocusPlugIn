import React, { useContext } from "react";
import { useFocus, FocusScope, useFocusManager } from "react-aria";
import ThemeContext from "./context/ThemeContext";
import "./index.less";

function ToolbarButton(props: any) {
  const [focusable, setFocusable] = React.useState(
    props.tabIndex === 0 ? true : false
  );
  const focusManager = useFocusManager();

  const { focusProps } = useFocus({
    onFocus: (e) => setFocusable(true),
    onBlur: (e) => setFocusable(false),
  });

  const onKeyDown = (e: { key: any }) => {
    switch (e.key) {
      case "ArrowRight":
        focusManager.focusNext({ wrap: true, tabbable: false }).tabIndex = 0;
        break;
      case "ArrowLeft":
        focusManager.focusPrevious({ wrap: true, tabbable: false });
        break;
      case "Home":
        focusManager.focusFirst({ wrap: true, tabbable: false });
        break;
      case "End":
        focusManager.focusLast({ wrap: true, tabbable: false });
        break;
    }
  };

  return (
    <button
      tabIndex={focusable ? 0 : -1}
      onKeyDown={onKeyDown}
      {...props}
      {...focusProps}
    >
      1
    </button>
  );
}

const Toolbar: React.FC = () => {
  const appTheme = useContext(ThemeContext);

  return (
    <div
      className={`${appTheme} toolbar`}
      role="toolbar"
      aria-label="NerdeFocus Controls"
    >
      <FocusScope>
        <ToolbarButton tabIndex={0} />
        <ToolbarButton />
        <ToolbarButton />
      </FocusScope>
    </div>
  );
};

export default Toolbar;
