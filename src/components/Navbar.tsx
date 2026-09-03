"use client";

import Link from "next/link";
import { Briefcase, LayoutGrid, Table, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Briefcase className="size-5 text-primary" />
          <span>JobHunt</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/" className={navLinkClass}>
            <LayoutGrid className="size-4" />
            <span className="ml-1.5 hidden sm:inline">Dashboard</span>
          </Link>
          <Link href="/jobs" className={navLinkClass}>
            <Table className="size-4" />
            <span className="ml-1.5 hidden sm:inline">List</span>
          </Link>
          <Link href="/kanban" className={navLinkClass}>
            <LayoutGrid className="size-4" />
            <span className="ml-1.5 hidden sm:inline">Kanban</span>
          </Link>
          <Link href="/calendar" className={navLinkClass}>
            <Calendar className="size-4" />
            <span className="ml-1.5 hidden sm:inline">Calendar</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

const navLinkClass = "inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[0.8rem] font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground";
