"use client";
import {
  Priority as PriorityType,
  Status as StatusType,
  Project as ProjectType,
  Task as TaskType,
} from "@/app/store/api";
import Header from "@/app/components/Header";
import { useTheme } from "next-themes";
import { useState, useMemo, useEffect } from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import { format } from "date-fns";
import { motion } from "framer-motion";

import { useLogoutMutation } from "@/app/store/api";

import { useGetProjectsByUserIdQuery } from "@/app/store/api";
import { IoChevronDownOutline } from "react-icons/io5";

//? Search about pie charts

// TODO: Adjust time Preview in table
// TODO: Search On All cells Not title only
// TODO: Handle Loading Process
// TODO: Debug Due Date Problem (Active / Completed)
// TODO: Enhance Status / Priority UI In tables
// TODO: highlight Search
// TODO: Hover On Row Delet Icon Appear

// !Features For Table
// TODO: Filters options [ Search tasks... ] [ All Status ▼ ] [ All Priority ▼ ] [ All Assignees ▼ ] (Not Search Input)
// TODO: View Edit Delete Task From Table
// TODO: Pagination
// TODO: Selection Or Filter Options
// TODO: Column Visibility

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Input from "@/app/components/SearchInput";

const taskColumns: ColumnDef<TaskType>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as StatusType;

      const statusStyles: Record<StatusType, string> = {
        [StatusType.ToDo]: "bg-slate-500/15 text-slate-500",
        [StatusType.WorkInProgress]: "bg-blue-500/15 text-blue-500",
        [StatusType.UnderReview]: "bg-purple-500/15 text-purple-500",
        [StatusType.Completed]: "bg-green-500/15 text-green-500",
      };
      return (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[status] ?? "bg-gray-500/15 text-gray-500"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ getValue }) => {
      const priority = getValue() as PriorityType;

      const priorityStyles: Record<PriorityType, string> = {
        [PriorityType.Low]: "bg-green-500/15 text-green-500",
        [PriorityType.Medium]: "bg-yellow-500/15 text-yellow-500",
        [PriorityType.High]: "bg-orange-500/15 text-orange-500",
        [PriorityType.Urgent]: "bg-red-500/15 text-red-500",
        [PriorityType.Backlog]: "bg-violet-500/15 text-violet-500",
      };

      return (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            priorityStyles[priority] ?? "bg-gray-500/15 text-gray-500"
          }`}
        >
          {priority}
        </span>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ getValue }) => {
      const startDate = getValue() as TaskType["startDate"];
      if (!startDate) {
        return <span>-</span>;
      }
      const formattedDate = format(new Date(startDate), "MMM d yyyy");

      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ getValue }) => {
      const dueDate = getValue() as TaskType["dueDate"];
      if (!dueDate) {
        return <span>-</span>;
      }
      const formattedDate = format(new Date(dueDate), "MMM d yyyy");

      return <span>{formattedDate}</span>;
    },
  },
];

//For Bar Charts
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const PRIORITY_COLORS: Record<PriorityType, string> = {
  [PriorityType.Low]: "#22C55E",
  [PriorityType.Medium]: "#EAB308",
  [PriorityType.High]: "#F97316",
  [PriorityType.Urgent]: "#EF4444",
  [PriorityType.Backlog]: "#8B5CF6",
};
const PROJECT_STATUS_COLORS: Record<string, string> = {
  Active: "#6366F1", // Indigo
  Completed: "#10B981", // Emerald
};

const HomePage = () => {
  const [logout] = useLogoutMutation();
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );

  const { resolvedTheme } = useTheme();

  const {
    data,
    isLoading: isProjectsLoading,
    error: projectsErrorData,
  } = useGetProjectsByUserIdQuery();

  const { projects } = data ?? {};

  const selectedProjectIdToUse = selectedProjectId ?? projects?.[0]?.id ?? null;

  const selectedProject = projects?.find(
    (project) => project.id === selectedProjectIdToUse,
  );

  const filteredTasks = useMemo(() => {
    return (
      selectedProject?.tasks?.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()),
      ) ?? []
    );
  }, [selectedProject, search]);

  useEffect(() => {
    setSearch("");
  }, [selectedProjectIdToUse]);

  const table = useReactTable({
    data: filteredTasks,
    columns: taskColumns,

    state: {
      sorting,
    },

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isProjectsLoading) {
    return <div>Loading...</div>;
  }

  if (projectsErrorData) {
    return <div>Projects error</div>;
  }
  if (!selectedProject?.tasks) {
    return <div>Tasks error</div>;
  }

  if (!projects || projects.length === 0) {
    return (
      <div>
        <div>No projects found</div>
        <button
          className="p-5 bg-pink-400 rounded-2xl cursor-pointer"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  if (!selectedProject) {
    return <div>Selected project not found</div>;
  }
  const priorityCount = selectedProject.tasks.reduce(
    (acc: Record<string, number>, task: TaskType) => {
      const { priority } = task;
      acc[priority as PriorityType] = (acc[priority as PriorityType] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
    fill: PRIORITY_COLORS[key as PriorityType],
  }));

  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: ProjectType) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
    fill: PROJECT_STATUS_COLORS[key],
  }));

  const chartColors =
    resolvedTheme === "dark"
      ? {
          bar: "#8884d8",
          barGrid: "#303030",
          pieFill: "#4A90E2",
          text: "#FFFFFF",
          fill: "#ffffff20",
        }
      : {
          bar: "#8884d8",
          barGrid: "#E0E0E0",
          pieFill: "#82ca9d",
          text: "#000000",
          fill: "#1e1e1e20",
        };

  return (
    <div className="h-full w-full bg-mainBackground p-8">
      <Header name={`${selectedProject.name} Project Management Dashboard`} />
      <div className="w-full flex justify-end mb-3">
        {/* <button
          className="py-3 px-5 bg-primary rounded-2xl cursor-pointer"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button> */}
        <div className="relative">
          <select
            value={selectedProjectIdToUse ?? ""}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            style={{ fontWeight: 500 }}
            className="
      appearance-none
      w-full
      min-w-45
      py-2.5
      pl-4
      pr-10
      text-sm
      text-mainText
      bg-input
      border
      border-mainBorder
      rounded-xl
      outline-none
      cursor-pointer
      transition-all
      duration-200
      hover:border-primary
      focus:border-primary
      focus:ring-2
      focus:ring-primary/20
    "
          >
            {projects.map((project) => (
              <option
                key={project.id}
                value={project.id}
                className="bg-mainBackground"
              >
                {project.name}
              </option>
            ))}
          </select>

          <IoChevronDownOutline
            style={{ fontWeight: 100 }}
            className="
      pointer-events-none
      absolute
      right-3
      top-1/2
      -translate-y-1/2
      w-4
      h-4
      text-gray-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-card p-4 shadow">
          <h3 className="mb-4 text-lg font-semibold">
            Task Priority Distribution
          </h3>
          {/* Task Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "min-content",

                  // backgroundColor: "red",
                }}
                cursor={{ fill: chartColors.fill }} // Hover Color
              />
              <Bar
                dataKey="count"
                name={"Tasks"}
                fill={chartColors.bar}
                // activeBar={{ fill: "#00ff00" }}
              />
              {/* <Legend /> */}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="relative overflow-hidden rounded-lg bg-card p-4 shadow">
          <h3 className="mb-4 text-lg font-semibold">Project Status</h3>
          <motion.div
            initial={{ opacity: 0, x: 60, y: -60 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ ease: "easeInOut", duration: 1 }}
            className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary-hover/30"
          />
          <motion.div
            initial={{ opacity: 0, x: -60, y: 60 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ ease: "easeInOut", duration: 1 }}
            className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-hover/30"
          />
          {/* Project Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="count" data={projectStatus} label>
                {/* {projectStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))} */}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="relative rounded-lg md:min-h-[60vh] mb-5 bg-card p-4 shadow md:col-span-2">
          {/* <h3 className="mb-4 text-lg font-semibold ">Your Tasks</h3> */}
          <Input
            type="text"
            placeholder="Search for tasks title..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mb-2"
          />
          <div className="w-full overflow-hidden rounded-xl border border-mainBorder bg-mainBackground ">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-input">
                  {/* Head Of Table */}
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className="border-b border-mainBorder"
                    >
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-5 py-4 text-sm font-semibold text-mainText"
                        >
                          {header.isPlaceholder ? null : (
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              className="flex cursor-pointer items-center gap-2"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}

                              {{
                                asc: "↑",
                                desc: "↓",
                              }[header.column.getIsSorted() as string] ?? ""}
                            </button>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                {/* when Table Is Loading */}
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-mainBorder transition-colors hover:bg-input"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-5 py-4 text-sm text-mainText"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

//? npm i recharts --legacy-peer-deps

export default HomePage;

{
  /* {isProjectsLoading ? (
  <tr>
    <td
      colSpan={taskColumns.length}
      className="px-5 py-10 text-center text-mainText"
    >
      Loading...
    </td>
  </tr>
) : // No Tasks In Table */
}
{
  /* table.getRowModel().rows.length === 0 ? (
  <tr>
    <td
      colSpan={taskColumns.length}
      className="px-5 py-10 text-center text-mainText"
    >
      No tasks found.
    </td>
  </tr>
) : ( */
}
