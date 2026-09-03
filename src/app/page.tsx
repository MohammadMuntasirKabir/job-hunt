"use client";

import { useEffect } from "react";
import { Plus, Briefcase, Phone, Code, Trophy, XCircle, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useJobs, seedDemoJobs } from "@/lib/storage";
import { countJobStats } from "@/lib/types";
import { StatsCard } from "@/components/StatsCard";
import JobCard from "@/components/JobCard";

export default function Dashboard() {
  const jobs = useJobs();

  useEffect(() => {
    if (jobs.length === 0) {
      seedDemoJobs();
    }
  }, [jobs.length]);

  const stats = countJobStats(jobs);

  return (
    <div className="min-h-screen pb-20">
      <div className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">Overview of your job search progress</p>
            </div>
            <Link href="/jobs/new" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80">
              <Plus className="size-4" />
              <span>Add Application</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Stats grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard icon={<Briefcase className="size-5 text-sky-500" />} label="Total Applications" value={stats.total} color="bg-sky-500/10" />
          <StatsCard icon={<TrendingUp className="size-5 text-amber-500" />} label="Active" value={stats.active} color="bg-amber-500/10" />
          <StatsCard icon={<Trophy className="size-5 text-emerald-500" />} label="Offers" value={stats.offers} color="bg-emerald-500/10" />
          <StatsCard icon={<XCircle className="size-5 text-rose-500" />} label="Rejections" value={stats.rejections} color="bg-rose-500/10" />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard icon={<Phone className="size-5 text-violet-500" />} label="Phone Screens" value={stats.phoneScreen} color="bg-violet-500/10" />
          <StatsCard icon={<Code className="size-5 text-blue-500" />} label="Technical" value={stats.technical} color="bg-blue-500/10" />
          <StatsCard icon={<Calendar className="size-5 text-orange-500" />} label="Upcoming Interviews" value={stats.upcomingInterviews} color="bg-orange-500/10" />
          <StatsCard icon={<TrendingUp className="size-5 text-teal-500" />} label="Response Rate" value={`${stats.responseRate}%`} color="bg-teal-500/10" />
        </div>

        {/* Recent applications */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Applications</h2>
            <Link href="/jobs" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 text-center">
              <Briefcase className="size-10 text-muted-foreground" />
              <p className="mt-3 font-medium">No applications yet</p>
              <p className="text-sm text-muted-foreground">Add your first job application to get started</p>
              <Link href="/jobs/new" className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80">
                <Plus className="size-4" />
                <span>Add Application</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
