"use client";
import { useMemo, useEffect, useState, useRef } from "react";
import { useGetProjectsQuery } from "@/app/store/api";
import Header from "@/app/components/Header";
import { gantt, type Scales } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { format } from "date-fns";
import { Status as StatusType, Task as TaskType } from "@/app/store/api";

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
const projectColors = [
  "#6366f1", // Indigo
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#ef4444", // Red
  "#8b5cf6", // Violet
];
const taskColors = [
  "#818cf8", // Indigo
  "#60a5fa", // Blue
  "#34d399", // Emerald
  "#fbbf24", // Amber
  "#f472b6", // Pink
  "#22d3ee", // Cyan
  "#f87171", // Red
  "#a78bfa", // Violet
];

const ProjectsTimelineView = () => {
  const ganttContainer = useRef<HTMLDivElement>(null);
  const ganttInitialized = useRef(false);

  // const [search, setSearch] = useState("");
  // const [priority, setPriority] = useState("all");
  // const [status, setStatus] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("monthWeek");

  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode);

    gantt.config.scales = viewModes[mode];
    gantt.render();
  };

  const { data: projects, error, isLoading } = useGetProjectsQuery();

  const ganttData = useMemo(() => {
    if (!projects) return [];

    return (
      projects.flatMap((project, index) => {
        const projectTask = project?.tasks?.filter(
          (task) => task.startDate && task.dueDate,
        );

        const totalTasks = project.tasks?.length ?? 0;
        const completedTasks =
          project.tasks?.filter(
            (task: TaskType) => task.status === StatusType.Completed,
          ).length || 0;

        const projectItem = {
          id: `project-${project.id}`,
          text: project.name,
          type: "project",
          start_date: format(new Date(project.startDate!), "yyyy-MM-dd"),
          end_date: format(new Date(project.endDate!), "yyyy-MM-dd"),
          progress: totalTasks > 0 ? completedTasks / totalTasks : 0,
          color: projectColors[index % projectColors.length],
        };

        const taskItems =
          projectTask?.map((task) => ({
            id: `task-${task.id}`,
            text: task.title,
            parent: `project-${project.id}`,
            type: "task",
            start_date: format(new Date(task.startDate!), "yyyy-MM-dd"),
            end_date: format(new Date(task.dueDate!), "yyyy-MM-dd"),
            progress:
              task.status !== undefined
                ? progressByStatus[task.status] / 100
                : 0,
            priority: task.priority,
            status: task.status,
            color: taskColors[index % taskColors.length],
          })) ?? [];

        return [projectItem, ...taskItems];
      }) ?? {}
    );
  }, [projects]);

  useEffect(() => {
    if (!ganttContainer.current || ganttInitialized.current) {
      return;
    }

    ganttInitialized.current = true;

    gantt.config.date_format = "%Y-%m-%d";

    // gantt.config.scales = viewModes[viewMode];

    gantt.config.columns = [
      {
        name: "text",
        label: "Project / Task",
        width: 150,
        template: (task) => {
          const isProject = task.type === "project";

          return `
              <div class="flex items-center"
              
              >
                <div
                  class="${isProject ? "" : "rounded-full"} p-2 w-1 h-1 mr-3"
                      style="
        
        
          background-color: ${task.color};
        
          flex-shrink: 0;
        "
                ></div>
                <span>${task.text}</span>
            </div>
          `;
        },
      },
      {
        name: "priority",
        label: "task Priority",
        tree: true,
        width: 150,
      },
      {
        name: "status",
        label: "task Status",
        tree: true,
        width: 150,
      },
    ];

    gantt.config.open_tree_initially = true;

    gantt.init(ganttContainer.current);

    return () => {
      gantt.clearAll();
    };
  }, [isLoading, projects]);

  useEffect(() => {
    if (!ganttData) return;

    gantt.clearAll();

    gantt.parse({
      data: ganttData,
    });
  }, [ganttData, isLoading]);

  if (isLoading) return <div>Loading...</div>;
  if (error || !projects)
    return <div>An error occurred while fetching projects</div>;

  return (
    <div className="w-full p-4">
      <header className="mb-4 flex items-center justify-between">
        <Header name="Projects Timeline" />
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
        {/* <div className="relative inline-block w-64"></div> */}
      </header>
      <div className="overflow-auto rounded-md bg-mainBackground shadow ">
        <div className="overflow-hidden rounded-md shadow h-full w-full ">
          <div ref={ganttContainer} className="h-130 w-full gantt-wrapper" />
        </div>
      </div>
    </div>
  );
};

export default ProjectsTimelineView;
