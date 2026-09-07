// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";

// type PageHeaderProps = {
//   title: string;
//   description?: string;
//   actionLabel?: string;
//   onAction?: () => void;
//   showBackButton?: boolean;
//   className?: string;
//   btnClassName?: string;
// };

// const PageHeader: React.FC<PageHeaderProps> = ({
//   title,
//   description,
//   actionLabel,
//   onAction,
//   showBackButton = false,
//   className,
//   btnClassName,
// }) => {
//   const router = useRouter();

//   return (
//     <div className={`flex justify-between items-center mb-6 ${className}`}>
//       {/* 🔹 Left Section */}
//       <div className="flex items-start gap-3">
//         {showBackButton && (
//           <Button variant="outline" size="icon" onClick={() => router.back()}>
//             <ArrowLeft size={16} />
//           </Button>
//         )}

//         <div>
//           <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>

//           {description && (
//             <p className="text-sm text-muted-foreground">{description}</p>
//           )}
//         </div>
//       </div>

//       {/* 🔹 Right Action */}
//       {actionLabel && (
//         <Button
//           size="sm"
//           onClick={onAction}
//           className={`gap-2 ${btnClassName}`}
//         >
//           {actionLabel}
//         </Button>
//       )}
//     </div>
//   );
// };

// export default React.memo(PageHeader);
