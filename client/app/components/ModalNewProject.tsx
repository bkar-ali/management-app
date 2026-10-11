"use client";
import { useState } from "react";
import { useCreateProjectMutation } from "../store/api";
import { formatISO } from "date-fns";
import Modal from "./Modal";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { closeNewProjectModal } from "../features/auth/globalSlice";

const ModalNewProject = () => {
  const { isNewProjectModalOpen } = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const resetForm = () => {
    setProjectName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  };

  const handleSubmit = async () => {
    if (!projectName || !startDate) return;
    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedEndDate = endDate
      ? formatISO(new Date(endDate), {
          representation: "complete",
        })
      : undefined;
    resetForm();

    await createProject({
      name: projectName,
      description,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    dispatch(closeNewProjectModal());
  };

  const isFormValid = () => {
    return projectName && description && startDate;
  };

  const inputStyles =
    "w-full rounded border-2 border-mainBorder p-2 shadow-sm focus:outline-none";

  return (
    <Modal
      isOpen={isNewProjectModalOpen}
      onClose={handleClose}
      name="Create New Project"
    >
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={inputStyles}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={`duration-300 mt-4 flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-primary ${
            !isFormValid() || isLoading
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-primary-hover cursor-pointer"
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewProject;
