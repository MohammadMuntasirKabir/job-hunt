"use client";

import Link from "next/link";
import { Briefcase, MapPin, DollarSign, ExternalLink } from "lucide-react";
import { JobApplication } from "@/lib/types";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";

export default function JobCard({ job }: { job: JobApplication }) {
  return (
    <div className="rounded-xl border bg-card p-4 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{job.position}</h3>
            <PriorityBadge priority={job.priority} />
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Briefcase className="size-3.5" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {job.location}
            </span>
          </div>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>Applied {job.appliedDate}</span>
          {job.salary && (
            <span className="flex items-center gap-1">
              <DollarSign className="size-3" />
              {job.salary}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {job.jobUrl && (
            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
              <ExternalLink className="size-4" />
            </a>
          )}
          <Link href={`/jobs/${job.id}`} className="text-xs font-medium text-primary hover:underline">
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
