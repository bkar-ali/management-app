import { initialStateTypes } from "./authTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: initialStateTypes = {
  isNewProjectModalOpen: false,
  isNewTaskModalOpen: false,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    openNewProjectModal: (state) => {
      state.isNewProjectModalOpen = true;
    },
    closeNewProjectModal: (state) => {
      state.isNewProjectModalOpen = false;
    },
    openNewTaskModal: (state) => {
      state.isNewTaskModalOpen = true;
    },
    closeNewTaskModal: (state) => {
      state.isNewTaskModalOpen = false;
    },
  },
});

export const {
  closeNewProjectModal,
  openNewProjectModal,
  closeNewTaskModal,
  openNewTaskModal,
} = globalSlice.actions;

export default globalSlice.reducer;
