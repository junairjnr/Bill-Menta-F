// // app/utilsComponents/ViewScrollBody.tsx
// "use client";

// import { useEffect, useRef } from "react";

// interface ViewScrollBodyProps {
//   children: React.ReactNode;
// }

// /**
//  * Scrollable body for tabbed views. It renders the sections and appends an
//  * adaptive spacer so the LAST section can always be scrolled up to just below
//  * the sticky header — otherwise clicking the final tab feels "stuck" because
//  * there isn't enough content beneath it to scroll.
//  */
// export default function ViewScrollBody({ children }: ViewScrollBodyProps) {
//   const bodyRef = useRef<HTMLDivElement>(null);
//   const spacerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const body = bodyRef.current;
//     const spacer = spacerRef.current;
//     if (!body || !spacer) return;

//     const update = () => {
//       const sections = Array.from(
//         body.querySelectorAll<HTMLElement>("[data-view-section]"),
//       );
//       const last = sections[sections.length - 1];
//       if (!last || sections.length < 2) {
//         spacer.style.height = "0px";
//         return;
//       }
//       const room = body.clientHeight - last.offsetHeight - 48;
//       spacer.style.height = `${Math.max(room, 0)}px`;
//     };

//     update();

//     const ro = new ResizeObserver(update);
//     ro.observe(body);
//     body
//       .querySelectorAll<HTMLElement>("[data-view-section]")
//       .forEach((s) => ro.observe(s));

//     return () => ro.disconnect();
//   }, [children]);

//   return (
//     <div
//       ref={bodyRef}
//       className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6"
//     >
//       {children}
//       <div ref={spacerRef} aria-hidden className="shrink-0" />
//     </div>
//   );
// }


"use client";

import { forwardRef } from "react";

interface Props {
  children: React.ReactNode;
}

const ViewScrollBody = forwardRef<HTMLDivElement, Props>(
  ({ children }, ref) => {
    return (
      <div
        ref={ref}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
      >
        {children}
      </div>
    );
  }
);

ViewScrollBody.displayName = "ViewScrollBody";

export default ViewScrollBody;