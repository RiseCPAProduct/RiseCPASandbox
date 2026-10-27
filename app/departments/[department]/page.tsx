import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { departmentFromSlug, departmentSlug } from "@/lib/departments";
import { DEPARTMENTS } from "@/lib/placeholder-documents";
import DepartmentView from "../../components/department-view";

export function generateStaticParams() {
  return DEPARTMENTS.map((department) => ({ department: departmentSlug(department) }));
}

export async function generateMetadata({ params }: PageProps<"/departments/[department]">): Promise<Metadata> {
  const department = departmentFromSlug((await params).department);
  return { title: department ? `${department} - RISE CPA Intranet` : "Not found - RISE CPA Intranet" };
}

export default async function DepartmentPage({ params }: PageProps<"/departments/[department]">) {
  const department = departmentFromSlug((await params).department);
  if (!department) notFound();

  return (
    <Suspense fallback={<h1 className="font-heading text-3xl font-bold text-brand-charcoal">{department}</h1>}>
      <DepartmentView department={department} />
    </Suspense>
  );
}
