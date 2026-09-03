"use client";

import { useJobs } from "@/lib/storage";
import { JobApplication, STATUS_ORDER, STATUS_META, JobStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import Link from "next/link";

export default function KanbanPage() {
  const jobs = useJobs();

  const jobsByStatus = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = jobs.filter(j => j.status === status);
    return acc;
  }, {} as Record<JobStatus, JobApplication[]>);

  return (
    <div className="min-h-screen pb-20">
      <div className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-bold">Kanban Board</h1>
          <p className="mt-1 text-sm text-muted-foreground">Visual pipeline of your applications</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUS_ORDER.map(status => {
            const meta = STATUS_META[status];
            const columnJobs = jobsByStatus[status];
            return (
              <div key={status} className="flex w-72 shrink-0 flex-col rounded-xl border bg-muted/30">
                {/* Column header */}
                <div className="flex items-center gap-2 border-b p-3">
                  <span className={`size-2.5 rounded-full ${meta.dot}`} />
                  <h3 className="text-sm font-medium">{meta.label}</h3>
                  <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {columnJobs.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 space-y-2 overflow-y-auto p-2">
                  {columnJobs.length === 0 ? (
                    <p className="py-8 text-center text-xs text-muted-foreground">No applications</p>
                  ) : (
                    columnJobs.map(job => (
                      <Link key={job.id} href={`/jobs/${job.id}`} className="block rounded-lg border bg-card p-3 transition-all hover:shadow-md">
                        <p className="text-sm font-medium">{job.position}</p>
                        <p className="text-xs text-muted-foreground">{job.company}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{job.appliedDate}</span>
                          <PriorityDot priority={job.priority} />
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PriorityDot({ priority }: { priority: string }) {
  const colors = { low: 'bg-slate-400', medium: 'bg-amber-500', high: 'bg-rose-500' };
  return <span className={`size-2 rounded-full ${colors[priority as keyof typeof colors] || 'bg-slate-400'}`} />;
}
