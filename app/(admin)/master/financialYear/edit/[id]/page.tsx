"use client";

import { useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { useFinancialYear } from "@/app/hooks/financialYearHook/useFinancialYear";
import React from "react";

const FinancialYearEditPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useFinancialYear(id ?? "");
  const onCancel = useCallback(() => router.back(), [router]);
  const buttons = useMemo(
    () =>
      data
        ? [
            {
              label: "Back",
              variant: "outline" as const,
              onClick: onCancel,
              className: "rounded-lg px-6 py-2 text-sm font-semibold",
            },
          ]
        : [],
    [data, onCancel]
  );

  return (
    <BackPanel buttons={buttons}>
      <div className="mx-auto w-full max-w-xl p-6 space-y-6">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load financial year.</p>
        ) : data ? (
          <>
            <PageHeader
              title="Financial Year Details"
              description="Financial years are managed by the system and cannot be edited manually."
            />
            <dl className="space-y-4 rounded-lg border bg-white p-6 text-sm">
              <div>
                <dt className="text-muted-foreground">Label</dt>
                <dd className="font-medium">{data.label}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Start Date</dt>
                <dd className="font-medium">
                  {new Date(data.startDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">End Date</dt>
                <dd className="font-medium">
                  {new Date(data.endDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium">
                  {data.isActive ? "Active" : data.isClosed ? "Closed" : "Open"}
                </dd>
              </div>
            </dl>
          </>
        ) : null}
      </div>
    </BackPanel>
  );
};

export default React.memo(FinancialYearEditPage);
