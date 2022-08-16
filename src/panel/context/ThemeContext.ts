import React from "react";
const ThemeContext: React.Context<string> = React.createContext("light");
export const ThemeProvider = ThemeContext.Provider;
export default ThemeContext;
