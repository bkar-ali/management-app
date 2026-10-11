import {
  Task as TaskType,
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/app/store/api";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { FaEllipsisVertical } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { LuMessageSquareMore } from "react-icons/lu";

import { format } from "date-fns";
import Image from "next/image";
import { openNewTaskModal } from "@/app/features/auth/globalSlice";
import { useAppDispatch } from "@/app/hooks/reduxHooks";

type BoardProps = {
  id: string;
};

// TODO Touch Backend (Mobile)

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];
const BoardView = ({ id }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId: taskId, status: toStatus });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">ERROR...</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4 ">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
          />
        ))}
      </div>
    </DndProvider>
  );
};
type taskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
};
const TaskColumn = ({ status, tasks, moveTask }: taskColumnProps) => {
  const dispatch = useAppDispatch();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => {
      console.log("Dropped", item, status);
      moveTask(item.id, status);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  const tasksCount = tasks.filter((task) => task.status === status).length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statusColor: any = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      // ref={drop}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 h-scree ${isOver ? "bg-purple-800/5" : ""}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-card px-5 py-4">
          <h3 className="flex items-center text-lg font-semibold">
            {status}
            <span
              className="ml-2 inline-block w-6 h-6 rounded-full bg-mainBorder/60 p-1 text-center text-sm leading-none"
              // ?leading-none
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center">
              <FaEllipsisVertical size={26} />
            </button>
            <button
              className="cursor-pointer flex h-6 w-6 items-center justify-center rounded bg-mainBorder/60"
              onClick={() => dispatch(openNewTaskModal())}
            >
              <FaPlus size={16} />
            </button>
          </div>
        </div>
      </div>
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} />
        ))}
    </div>
  );
};

type TaskProps = {
  task: TaskType;
};

const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
  <div
    className={`rounded-full px-2 py-1 text-xs font-semibold ${
      priority === "Urgent"
        ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
        : priority === "High"
          ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
          : priority === "Medium"
            ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
            : priority === "Low"
              ? "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"
              : "bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400"
    }`}
  >
    {priority}
  </div>
);

const Task = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-4 rounded-md bg-card shadow ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-purple-400/10 text-purple-600 dark:text-purple-300 px-2 py-1 text-xs"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <button className="flex h-6 w-4 shrink-0 items-center justify-center dark:text-neutral-500">
            <FaEllipsisVertical size={26} />
          </button>
        </div>
        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold">{task.title}</h4>
          {/* {typeof task. === "number" && (
            <div className="text-xs font-semibold">{task.points} pts</div>
          )} */}
        </div>

        <div className="text-xs text-gray-500">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>

        <p className="text-sm text-gray-600">{task.description}</p>
        <div className="mt-4 border-t border-gray-200" />

        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-1.5 overflow-hidden">
            {/* Problem Here !!!! */}
            {task.assignee && (
              <Image
                key={task.assignee.userId}
                src={`/${task.assignee.profilePictureUrl}`}
                alt={task.assignee.username}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
            {task.author && (
              <Image
                key={task.author.userId}
                src={`/${task.author.profilePictureUrl}`}
                alt={task.author.username}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
          </div>
          {/* //TODO : Press Icon To See Commetns  */}
          <div className="flex items-center text-gray-500 dark:text-neutral-500">
            <LuMessageSquareMore size={20} />
            <span className="ml-1 text-sm dark:text-neutral-400">
              {numberOfComments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardView;
