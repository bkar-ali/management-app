"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetTasksQuery } from "@/app/store/api";
import { useAppDispatch } from "@/app/hooks/reduxHooks";
import { openNewTaskModal } from "@/app/features/auth/globalSlice";
import { gantt, type Scales } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { Status as statusType } from "@/app/store/api";

type Props = {
  id: string;
};

type ViewMode = "monthWeek" | "yearMonth";
const viewModes: Record<ViewMode, Scales> = {
  monthWeek: [
    {
      unit: "month",
      step: 1,
      format: "%F %Y",
    },
    {
      unit: "week",
      step: 1,
      format: "%W",
    },
  ],
  yearMonth: [
    {
      unit: "year",
      step: 1,
      format: "%Y",
    },
    {
      unit: "month",
      step: 1,
      format: "%M",
    },
  ],
};
const progressByStatus = {
  "To Do": 25,
  "Work In Progress": 50,
  "Under Review": 75,
  Completed: 100,
};
const taskColors = [
  "#6366f1", // Indigo
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#ef4444", // Red
  "#8b5cf6", // Violet
];

const TimelineView = ({ id }: Props) => {
  const dispatch = useAppDispatch();

  const ganttContainer = useRef<HTMLDivElement>(null);
  const ganttInitialized = useRef(false);

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("monthWeek");

  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode);

    gantt.config.scales = viewModes[mode];
    gantt.render();
  };

  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesPriority = priority === "all" || task.priority === priority;
      const matchesStatus = status === "all" || task.status === status;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, search, priority, status]);

  useEffect(() => {
    if (!ganttContainer.current || ganttInitialized.current) {
      return;
    }

    ganttInitialized.current = true;

    gantt.config.date_format = "%Y-%m-%d %H:%i";

    gantt.config.columns = [
      {
        name: "text",
        label: "Task",
        tree: true,
        width: 150,
      },
      {
        name: "start_date",
        label: "Start",
        align: "center",
        width: 100,
      },
      {
        name: "duration",
        label: "Duration",
        align: "center",
        width: 80,
      },
      {
        name: "priority",
        label: "Priority",
        align: "center",
        width: 100,
      },
      {
        name: "status",
        label: "Status",
        align: "center",
        width: 100,
      },
      // {
      //   name: "progress",
      //   label: "progress",
      //   align: "center",
      //   width: 80,
      // },
    ];

    gantt.config.scale_height = 50;

    // gantt.config.scales = [
    //   {
    //     unit: "month",
    //     step: 1,
    //     format: "%M %m",
    //   },
    // ];

    gantt.init(ganttContainer.current);

    return () => {
      gantt.clearAll();
    };
  }, [isLoading, tasks]);

  useEffect(() => {
    if (!tasks) return;

    gantt.clearAll();

    gantt.parse({
      data: filteredTasks
        .filter((task) => task.startDate && task.dueDate)
        .map((task, index) => ({
          id: task.id,
          text: task.title,
          start_date: task.startDate,
          end_date: task.dueDate,
          progress: progressByStatus[task.status ?? "To Do"] / 100,
          priority: task.priority,
          status: task.status,
          color: taskColors[index % taskColors.length],
        })),
    });
  }, [filteredTasks, tasks, isLoading]);

  if (isLoading) return <div>Loading...</div>;
  if (error || !tasks) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 py-5">
        {/* Header */}
        <h1 className="me-2 text-lg font-bold">Project Tasks Timeline</h1>
        <div className="relative inline-block w-64"></div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-md border px-3 py-2 outline-none"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border px-3 py-2 text-mainText"
        >
          <option value="all" className="bg-mainBackground">
            All Status
          </option>
          <option value={statusType.ToDo} className="bg-mainBackground">
            {statusType.ToDo}
          </option>
          <option
            value={statusType.WorkInProgress}
            className="bg-mainBackground"
          >
            {statusType.WorkInProgress}
          </option>
          <option value={statusType.UnderReview} className="bg-mainBackground">
            {statusType.UnderReview}
          </option>
          <option value={statusType.Completed} className="bg-mainBackground">
            {statusType.Completed}
          </option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-md border px-3 py-2 text-mainText"
        >
          <option value="all" className="bg-mainBackground">
            All Priorities
          </option>
          <option value="Low " className="bg-mainBackground">
            Low
          </option>
          <option value="Medium " className="bg-mainBackground">
            Medium
          </option>
          <option value="High " className="bg-mainBackground">
            High
          </option>
          <option value="Urgent " className="bg-mainBackground">
            Urgent
          </option>
          <option value="Backlog " className="bg-mainBackground">
            Backlog
          </option>
        </select>
        <select
          value={viewMode}
          onChange={(e) => changeViewMode(e.target.value as ViewMode)}
          className="rounded-md border px-3 py-2 text-mainText"
        >
          <option value="monthWeek" className="bg-mainBackground">
            Month / Week
          </option>
          <option value="yearMonth" className="bg-mainBackground">
            Year / Month
          </option>
        </select>
        <div className="px-4 pb-5 pt-1">
          <button
            className="flex items-center rounded bg-blue-400 px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => dispatch(openNewTaskModal())}
          >
            Add New Task
          </button>
        </div>
      </div>
      <div className="overflow-auto rounded-md shadow ">
        <div className="overflow-hidden rounded-md shadow">
          <div
            ref={ganttContainer}
            className="min-h-120 w-full gantt-wrapper"
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
