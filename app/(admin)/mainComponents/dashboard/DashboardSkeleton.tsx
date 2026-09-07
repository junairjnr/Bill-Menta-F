"use client";

function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="h-7 w-40 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="col-span-12 sm:col-span-6 xl:col-span-3">
              <div className="h-28 animate-pulse rounded-xl bg-muted" />
            </div>
          ))}

          <div className="col-span-12 lg:col-span-8">
            <div className="h-[340px] animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <div className="h-[340px] animate-pulse rounded-xl bg-muted" />
          </div>

          <div className="col-span-12 md:col-span-6 xl:col-span-4">
            <div className="h-[340px] animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-4">
            <div className="h-[340px] animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <div className="h-[340px] animate-pulse rounded-xl bg-muted" />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="h-[340px] animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="h-[340px] animate-pulse rounded-xl bg-muted" />
          </div>

          <div className="col-span-12">
            <div className="h-64 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
