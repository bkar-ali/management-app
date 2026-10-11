import Header from "@/app/components/Header";
import {
  useGetTasksQuery,
  Task as TaskType,
  Status as StatusType,
} from "@/app/store/api";
import { useAppDispatch } from "@/app/hooks/reduxHooks";
import { openNewTaskModal } from "@/app/features/auth/globalSlice";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import { useMemo, useState } from "react";
import Input from "@/app/components/SearchInput";
import { format } from "date-fns";

type Props = {
  id: string;
};
const statusStyles: Record<StatusType, string> = {
  [StatusType.ToDo]: "bg-slate-500/15 text-slate-500",
  [StatusType.WorkInProgress]: "bg-blue-500/15 text-blue-500",
  [StatusType.UnderReview]: "bg-purple-500/15 text-purple-500",
  [StatusType.Completed]: "bg-green-500/15 text-green-500",
};

const taskColumns: ColumnDef<TaskType>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "status",
    header: "Status",

    cell: ({ getValue }) => {
      const status = getValue() as StatusType;
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
  },
  {
    accessorKey: "tags",
    header: "Tags",
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
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => <div>{row.original.author?.username ?? "Unknown"}</div>,
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    cell: ({ row }) => (
      <div>{row.original.assignee?.username || "Unassigned"}</div>
    ),
  },
];

const TableView = ({ id }: Props) => {
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const dispatch = useAppDispatch();
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });
  const filteredUsers = useMemo(() => {
    return (
      tasks?.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()),
      ) ?? []
    );
  }, [tasks, search]);

  const table = useReactTable({
    data: filteredUsers,
    columns: taskColumns,

    state: {
      sorting,
    },

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  if (isLoading) return <div>Loading...</div>;
  if (error || !tasks) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="h-135 w-full px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="Table"
          buttonName="Add Task"
          event={() => dispatch(openNewTaskModal())}
          isSmallText
        />
        <Input
          type="text"
          placeholder="Search for Tasks Title..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="mb-3"
        />

        <div className="w-full rounded-xl border border-mainBorder bg-mainBackground ">
          <table className="w-full text-left">
            <thead className="bg-input">
              {/* Head Of Table */}
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-mainBorder">
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

            <tbody>
              {/* when Table Is Loading */}
              {isLoading ? (
                <tr>
                  <td
                    colSpan={taskColumns.length}
                    className="px-5 py-10 text-center text-mainText"
                  >
                    Loading...
                  </td>
                </tr>
              ) : // No Tasks In Table
              table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={taskColumns.length}
                    className="px-5 py-10 text-center text-mainText"
                  >
                    No tasks found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableView;
