"use client";
import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "../store/store";

const ProjectProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <NextThemesProvider
        attribute={"class"}
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </Provider>
  );
};

export default ProjectProvider;
