// TODO:
// if (
//   new Date(formData.dueDate) <
//   new Date(formData.startDate)
// ) {
//    alert("Due date must be after start date");
//    return;
// }

// TODO: handel paste data in inputs (assign id / project id / author id)

// TODO: Toast

// TODO: Zod Backend

// TODO: Remove Gannt-task-react

// ? Idea To Enhance UX
// useForm({
//   resolver: zodResolver(taskSchema),
//   defaultValues: initialState,

//   mode: "onSubmit",

//   reValidateMode: "onChange",
// });

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "../schemas/taskSchema";
import { z } from "zod";

type TaskFormInput = z.input<typeof taskSchema>;
type TaskFormData = z.output<typeof taskSchema>;

import { useCreateTaskMutation, Priority, Status } from "../store/api";
// import { useState } from "react";
import { formatISO } from "date-fns";
import Modal from "./Modal";

type Props = {
  id?: string | null;
};

import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { closeNewTaskModal } from "../features/auth/globalSlice";

const inputStyles =
  "w-full rounded border-2 border-mainBorder p-2 shadow-sm focus:outline-none ";
const selectStyles =
  "mb-4 block w-full rounded border border-gray-300 px-3 py-2";
const optionStyle = "bg-mainBackground";

const ModalNewTask = ({ id = null }: Props) => {
  const { isNewTaskModalOpen } = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();

  const [createTask, { isLoading }] = useCreateTaskMutation();

  const initialState: TaskFormInput = {
    title: "",
    description: "",
    status: Status.ToDo,
    priority: Priority.Backlog,
    tags: "",
    startDate: "",
    dueDate: "",
    authorUserId: "",
    assignedUserId: "",
    projectId: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TaskFormInput, undefined, TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialState,
    // mode: "onChange", // imediate Validation On any change
    // mode: "onBlur", // Start Validation When Get out From input ,
    mode: "onTouched",
  });

  // ? Handel Input Changes With State
  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //   >,
  // ) => {
  //   const { name, value } = e.target;

  //   if (["authorUserId", "assignedUserId", "projectId"].includes(name)) {
  //     if (!/^\d*$/.test(value)) return;
  //   }

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleClose = () => {
    reset();
    dispatch(closeNewTaskModal());
  };

  // ? From Validation & Submit
  // const isFormValid = Boolean(
  //   formData.title.trim() &&
  //   formData.title.trim().length >= 3 &&
  //   formData.description.length < 500 &&
  //   formData.authorUserId &&
  //   formData.assignedUserId &&
  //   formData.startDate &&
  //   formData.dueDate &&
  //   (id !== null || formData.projectId),
  // );

  // const handleSubmit = async () => {
  //   if (!isFormValid) return;

  //   const finalProjectId =
  //     id !== null ? Number(id) : Number(formData.projectId);

  //   try {
  //     await createTask({
  //       title: formData.title,
  //       description: formData.description,
  //       status: formData.status,
  //       priority: formData.priority,
  //       tags: formData.tags,
  //       startDate: formattedStartDate,
  //       dueDate: formattedDueDate || undefined,
  //       authorUserId: Number(formData.authorUserId),
  //       assignedUserId: Number(formData.assignedUserId),
  //       projectId: finalProjectId,
  //     }).unwrap();
  //   } catch (error) {
  //     console.error("Create Task Filed ," + error);
  //   }

  //   handleClose();
  // };

  const onSubmit = async (data: TaskFormData) => {
    console.log(data);

    const formattedStartDate = formatISO(new Date(data.startDate), {
      representation: "complete",
    });

    const formattedDueDate = formatISO(new Date(data.dueDate), {
      representation: "complete",
    });

    const finalProjectId = id !== null ? Number(id) : Number(data.projectId);

    try {
      await createTask({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        tags: data.tags,
        startDate: formattedStartDate,
        dueDate: formattedDueDate || undefined,
        authorUserId: data.authorUserId,
        assignedUserId: data.assignedUserId,
        projectId: finalProjectId,
      }).unwrap();
    } catch (error) {
      console.error("Create Task Filed ," + error);
    }

    handleClose();
  };

  return (
    <Modal
      isOpen={isNewTaskModalOpen}
      onClose={handleClose}
      name="Create New Task"
    >
      <form className="mt-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          className={inputStyles}
          placeholder="Title"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
        <textarea
          className={inputStyles}
          placeholder="Description"
          {...register("description")}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select className={selectStyles} {...register("status")}>
            <option value="" className={optionStyle}>
              Select Status
            </option>
            <option value={Status.ToDo} className={optionStyle}>
              To Do
            </option>
            <option value={Status.WorkInProgress} className={optionStyle}>
              Work In Progress
            </option>
            <option value={Status.UnderReview} className={optionStyle}>
              Under Review
            </option>
            <option value={Status.Completed} className={optionStyle}>
              Completed
            </option>
          </select>
          <select className={selectStyles} {...register("priority")}>
            <option value="" className={optionStyle}>
              Select Priority
            </option>
            <option value={Priority.Urgent} className={optionStyle}>
              Urgent
            </option>
            <option value={Priority.High} className={optionStyle}>
              High
            </option>
            <option value={Priority.Medium} className={optionStyle}>
              Medium
            </option>
            <option value={Priority.Low} className={optionStyle}>
              Low
            </option>
            <option value={Priority.Backlog} className={optionStyle}>
              Backlog
            </option>
          </select>
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          {...register("tags")}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            {...register("startDate")}
          />
          {errors.startDate && (
            <p className=" text-sm text-red-500">{errors.startDate.message}</p>
          )}

          <input type="date" className={inputStyles} {...register("dueDate")} />
          {errors.dueDate && (
            <p className="text-sm text-red-500">{errors.dueDate.message}</p>
          )}
        </div>
        <input
          type="number"
          inputMode="numeric"
          className={inputStyles}
          placeholder="Author User ID"
          {...register("authorUserId")}
        />
        <input
          type="number"
          inputMode="numeric"
          className={inputStyles}
          placeholder="Assigned User ID"
          {...register("assignedUserId")}
        />
        {id === null && (
          <input
            type="number"
            inputMode="numeric"
            className={inputStyles}
            placeholder="ProjectId"
            {...register("projectId")}
          />
        )}

        <button
          type="submit"
          className={`duration-300 mt-4 flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-primary ${
            !isValid || isLoading
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-primary-hover cursor-pointer"
          }`}
          disabled={!isValid || isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;

// SELECT MAX(id) FROM "Task";

// SELECT setval(
//     pg_get_serial_sequence('"Task"', 'id'),
//     (SELECT MAX(id) FROM "Task")
// );
