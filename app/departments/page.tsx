import type { Metadata } from "next";
import DepartmentNav from "../components/department-nav";

export const metadata: Metadata = { title: "Departments - RISE CPA Intranet" };

export default function DepartmentsPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brand-charcoal">Departments</h1>
      <p className="mt-1 mb-4 text-brand-charcoal">Open a department or jump straight to one of its folders.</p>
      <DepartmentNav />
    </div>
  );
}
