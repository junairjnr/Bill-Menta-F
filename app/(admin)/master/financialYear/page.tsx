// import BackPanel from "@/app/utilsComponents/BackPanel";
// import PageHeader from "@/app/utilsComponents/PageHeader";
// import React from "react";

// const FinancialYearPage = () => {
//   return (
//     <BackPanel>
//       <div className="p-6 space-y-6">
//         <PageHeader
//           title="Financial Year Management"
//           description="Manage your financial years here."
//         //   actionLabel="+ Add Financial Year"
//           btnClassName="px-4 py-2 bg-black text-white rounded-md text-sm"
//         />
//       </div>
//     </BackPanel>
//   );
// };
// export default React.memo(FinancialYearPage);

"use client";

import React from "react";
import BackPanel from "@/app/utilsComponents/BackPanel";
import PageHeader from "@/app/utilsComponents/PageHeader";
import {
  useActiveFY,
  useFinancialYears,
  useSwitchFY,
} from "@/app/hooks/financialYearHook/useFinancialYear";

const FinancialYearPage = () => {
  const { data: activeFY } = useActiveFY();
  const { data: allFYs = [], isLoading } = useFinancialYears();
  const { mutate: switchFY, isPending } = useSwitchFY();

  const handleSwitch = (fyId: string) => {
    if (activeFY && !activeFY.isClosed) {
      alert(
        "You must close the current active financial year before switching."
      );
      return;
    }

    switchFY(fyId);
  };

  return (
    <BackPanel>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Financial Year Management"
          description="Manage your financial years here."
        />

        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">FY Name</th>
                <th className="px-4 py-3 text-left">Start Date</th>
                <th className="px-4 py-3 text-left">End Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            {/* //currently stopped here */}

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : activeFY ? (
                <tr key={activeFY._id} className="border-t">
                  <td className="px-4 py-3">{activeFY.label}</td>

                  <td className="px-4 py-3">
                    {new Date(activeFY.startDate).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(activeFY.endDate).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    {activeFY.isActive ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : activeFY.isClosed ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                        Closed
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                        Open
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {activeFY.isActive ? (
                      <span className="font-medium text-green-600">
                        Current FY
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSwitch(activeFY._id)}
                        disabled={isPending}
                        className="px-3 py-1 text-sm text-white bg-black rounded disabled:opacity-50"
                      >
                        {isPending ? "Switching..." : "Switch"}
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center">
                    No Financial Year Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {activeFY && !activeFY.isClosed && (
          <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <p className="text-sm text-yellow-800">
              The current financial year must be closed before another financial
              year can be activated.
            </p>
          </div>
        )}
      </div>
    </BackPanel>
  );
};

export default React.memo(FinancialYearPage);
