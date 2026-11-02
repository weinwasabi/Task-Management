export const dataGridClassNames =
  "rounded-2xl border border-line bg-surface text-ink";

export const dataGridSxStyles = (_isDarkMode: boolean) => ({
  border: "1px solid rgb(var(--color-line))",
  borderRadius: "16px",
  backgroundColor: "rgb(var(--color-surface))",
  color: "rgb(var(--color-ink))",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "rgb(var(--color-subtle))",
    borderBottom: "1px solid rgb(var(--color-line))",
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "12px",
    letterSpacing: "0.02em",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid rgb(var(--color-line))",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "rgb(var(--color-subtle))",
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "1px solid rgb(var(--color-line))",
  },
  "& .MuiButtonBase-root, & .MuiTablePagination-root": {
    color: "rgb(var(--color-ink))",
  },
  "& .MuiDataGrid-withBorderColor": {
    borderColor: "rgb(var(--color-line))",
  },
});
