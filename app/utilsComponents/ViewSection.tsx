// // app/utilsComponents/ViewSection.tsx
// "use client";

// interface ViewSectionProps {
//   id:       string;
//   title:    string;
//   children: React.ReactNode;
// }

// export default function ViewSection({
//   id,
//   title,
//   children,
// }: ViewSectionProps) {
//   return (
//     <section
//       id={id}
//       data-view-section
//       className="scroll-mt-6 bg-white rounded-xl border p-6"
//     >
//       <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest border-b pb-3 mb-6">
//         {title}
//       </h2>
//       {children}
//     </section>
//   );
// }

"use client";

import { forwardRef } from "react";

interface Props {
  id: string;
  title: string;
  children: React.ReactNode;
}

const ViewSection = forwardRef<HTMLElement, Props>(
  ({ id, title, children }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        className="bg-white border rounded-xl p-6"
      >
        <h2 className="mb-6 border-b pb-3 text-sm font-semibold uppercase tracking-widest text-gray-400">
          {title}
        </h2>

        {children}
      </section>
    );
  }
);

ViewSection.displayName = "ViewSection";

export default ViewSection;