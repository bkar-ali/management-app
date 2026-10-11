"use client";

//Redux TKQ
import {
  useGetProjectsByUserIdQuery,
  Project as ProjectType,
} from "@/app/store/api";
//Hooks & states
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
// component
import Header from "@/app/components/Header";
import Input from "@/app/components/SearchInput";

// tanstack Table
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
//Date-fns
import { format } from "date-fns";
//Redux
import { useAppDispatch } from "@/app/hooks/reduxHooks";
import { openNewProjectModal } from "@/app/features/auth/globalSlice";
import ModalNewProject from "@/app/components/ModalNewProject";
import Image from "next/image";
import Breadcrumbs from "@/app/components/Breadcrumbs";

const projectColumns: ColumnDef<ProjectType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ row }) => {
      const members = row.original.members;
      return (
        <div className="flex items-center">
          {members?.slice(0, 4).map((member) => (
            <Image
              key={member.userId}
              src={`/${member.profilePictureUrl}`}
              alt={member.username}
              title={member.username}
              width={32}
              height={32}
              className="-ml-2 h-8 w-8 rounded-full border-2 border-mainBackground object-cover first:ml-0"
            />
          ))}

          {members && members.length > 4 && (
            <span className="-ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-mainBackground bg-gray-300 dark:bg-gray-600 text-xs text-mainText">
              +{members.length - 4}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "status",
    accessorKey: "endDate",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() ? "Completed" : "Active";

      const statusStyles: Record<string, string> = {
        Active: "bg-slate-500/15 text-slate-500",

        Completed: "bg-green-500/15 text-green-500",
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
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ getValue }) => {
      const startDate = getValue() as ProjectType["startDate"];
      if (!startDate) {
        return <span>-</span>;
      }
      const formattedDate = format(new Date(startDate), "MMM d yyyy");

      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ getValue }) => {
      const startDate = getValue() as ProjectType["endDate"];
      if (!startDate) {
        return <span>-</span>;
      }
      const formattedDate = format(new Date(startDate), "MMM d yyyy");

      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];

const ProjectPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, isLoading: isProjectsLoading } = useGetProjectsByUserIdQuery();
  const { projects } = data ?? {};
  // const { data: projects, isLoading: isProjectsLoading } =
  //   useGetProjectsQuery();

  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const filterdProjects = useMemo(() => {
    return (
      projects?.filter((project) =>
        project.name.toLowerCase().includes(search.toLowerCase()),
      ) ?? []
    );
  }, [projects, search]);

  const table = useReactTable({
    data: filterdProjects,
    columns: projectColumns,

    state: {
      sorting,
    },

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-3">
      <ModalNewProject />

      <Breadcrumbs
        items={[
          {
            label: "Projects",
            href: "/projects",
          },
        ]}
      />
      <Header
        name="Projects"
        buttonName="New Boards"
        event={() => dispatch(openNewProjectModal())}
      />
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
              {isProjectsLoading ? (
                <tr>
                  <td
                    colSpan={projectColumns.length}
                    className="px-5 py-10 text-center text-mainText"
                  >
                    Loading...
                  </td>
                </tr>
              ) : // No Tasks In Table
              table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={projectColumns.length}
                    className="px-5 py-10 text-center text-mainText"
                  >
                    No tasks found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => router.push(`projects/${row.original.id}`)}
                    className="border-b  border-mainBorder transition-colors hover:bg-input"
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

export default ProjectPage;
