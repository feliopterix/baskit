import React, { createContext, useContext } from "react";
import themeData from "./theme.data.json";

type ThemePalette = {
  accentColor: {
    active: string;
    passive: string;
  };
  surface: {
    background: string;
    card: string;
    cardSoft: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  button: {
    foreground: string;
  };
};

export type BaskitTheme = ThemePalette & {
  radius: {
    card: number;
    pill: number;
    button: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  elevation: {
    card: {
      shadowColor: string;
      shadowOpacity: number;
      shadowRadius: number;
      shadowOffset: { width: number; height: number };
      elevation: number;
    };
  };
};

const defaultTheme: BaskitTheme = {
  ...(themeData as ThemePalette),
  radius: {
    card: 18,
    pill: 999,
    button: 16,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  elevation: {
    card: {
      shadowColor: "#000000",
      shadowOpacity: 0.28,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
  },
};

const ThemeContext = createContext<BaskitTheme>(defaultTheme);

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useBaskitTheme() {
  return useContext(ThemeContext);
}

export const baskitTheme = defaultTheme;
