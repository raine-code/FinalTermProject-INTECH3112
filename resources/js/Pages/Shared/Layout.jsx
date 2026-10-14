import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { FaSeedling } from "react-icons/fa";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    const { auth = {}, flash = {} } = usePage().props;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const user = auth.user;
    const roles = auth.roles || [];

    const initials =
        `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase() ||
        user?.username?.slice(0, 2).toUpperCase() ||
        "ST";

    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-[#edf2ef] text-slate-800">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-[#f5f7f6] backdrop-blur-sm">
                <div className="flex h-14 items-center justify-between px-3 sm:px-5">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0f766e] text-lg text-white shadow-sm">
                            <FaSeedling />
                        </span>
                        <div>
                            <div className="text-[11px] font-black tracking-[0.22em] text-slate-900">
                                SEEDTRACK
                            </div>
                            <div className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
                                Genebank operations
                            </div>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-4 md:flex">
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            {roles[0] || "Admin"}
                        </div>
                        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-700">
                                {initials}
                            </span>
                            <div className="pr-1 text-right">
                                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                    {user?.first_name || "Admin"}{" "}
                                    {user?.last_name || "User"}
                                </div>
                                <div className="text-[9px] uppercase tracking-[0.14em] text-emerald-700">
                                    {roles.join(", ") || "ADMIN"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex min-h-0 flex-1">
                <div
                    className={`${sidebarCollapsed ? "w-[60px] sm:w-[68px]" : "w-[60px] sm:w-[244px]"} shrink-0 transition-[width] duration-200`}
                >
                    <Sidebar
                        collapsed={sidebarCollapsed}
                        onToggle={() =>
                            setSidebarCollapsed((current) => !current)
                        }
                    />
                </div>

                <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    {flash.success && (
                        <div className="px-3 pt-3 sm:px-4">
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                {flash.success}
                            </div>
                        </div>
                    )}
                    <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
