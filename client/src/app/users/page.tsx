"use client";
import { useGetUsersQuery } from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

const CustomToolbar = () => (
  <GridToolbarContainer className="flex gap-2 border-b border-line p-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 100 },
  { field: "username", headerName: "Username", width: 150 },
  {
    field: "profilePictureUrl",
    headerName: "User",
    width: 100,
    renderCell: (params) => (
      <div className="flex h-full w-full items-center justify-center">
        <span
          aria-label={`${params.row.username} avatar`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-subtle font-mono font-semibold text-ink"
        >
          {String(params.row.username).charAt(0).toUpperCase()}
        </span>
      </div>
    ),
  },
];

const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) return <p className="app-page text-muted">Loading users...</p>;
  if (isError || !users)
    return (
      <p role="alert" className="app-page text-ink">
        Could not load users.
      </p>
    );

  return (
    <div className="app-page">
      <Header name="Users" />
      <div className="h-[650px] w-full overflow-x-auto">
        <div className="h-full min-w-[560px]">
          <DataGrid
            rows={users || []}
            columns={columns}
            getRowId={(row) => row.userId}
            pagination
            slots={{
              toolbar: CustomToolbar,
            }}
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
          />
        </div>
      </div>
    </div>
  );
};

export default Users;
