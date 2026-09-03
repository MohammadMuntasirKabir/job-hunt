import { JobApplication, STATUS_LABEL } from "./types";

export function exportToCSV(jobs: JobApplication[]): void {
  const headers = ["Company", "Position", "Location", "Status", "Priority", "Applied Date", "Salary", "Job URL", "Notes", "Resume Version"];
  const rows = jobs.map(job => [
    job.company,
    job.position,
    job.location,
    STATUS_LABEL[job.status],
    job.priority,
    job.appliedDate,
    job.salary || "",
    job.jobUrl || "",
    job.notes || "",
    job.resumeVersion || "",
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `job-hunt-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
