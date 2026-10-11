"use client";
import { useGetTeamsQuery, Team as TeamType } from "@/app/store/api";
import Header from "@/app/components/Header";
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

const taskColumns: ColumnDef<TeamType>[] = [
  {
    accessorKey: "id",
    header: "Team Id",
  },
  {
    accessorKey: "teamName",
    header: "Team Name",
  },
];

const Teams = () => {
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data: teams, isLoading: teamIsLoading, isError } = useGetTeamsQuery();

  const filteredTeams = useMemo(() => {
    return (
      teams?.filter((team) =>
        team.teamName.toLowerCase().includes(search.toLowerCase()),
      ) ?? []
    );
  }, [teams, search]);

  const table = useReactTable({
    data: filteredTeams,
    columns: taskColumns,

    state: {
      sorting,
    },

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (teamIsLoading) return <div>Loading...</div>;
  if (isError || !teams) return <div>Error fetching teams</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Teams" />
      <Input
        type="text"
        placeholder="Search for Teams Name..."
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
            {teamIsLoading ? (
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
  );
};

export default Teams;
