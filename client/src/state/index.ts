import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initialStateTypes {
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  isDarkMode: boolean;
  themePreference: "system" | "light" | "dark";
}

const initialState: initialStateTypes = {
  isSidebarCollapsed: false,
  isMobileMenuOpen: false,
  isDarkMode: false,
  themePreference: "system",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setThemePreference: (
      state,
      action: PayloadAction<initialStateTypes["themePreference"]>,
    ) => {
      state.themePreference = action.payload;
    },
  },
});

export const {
  setIsSidebarCollapsed,
  setIsMobileMenuOpen,
  setIsDarkMode,
  setThemePreference,
} = globalSlice.actions;
export default globalSlice.reducer;
