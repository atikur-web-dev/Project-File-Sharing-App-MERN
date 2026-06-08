// import { useState } from "react";
// import { cn, getInitials, stringToColor } from "../../lib/utils";

// interface AvatarProps {
//   name: string;
//   src?: string;
//   alt?: string;
//   size?: "sm" | "md" | "lg" | "xl";
//   className?: string;
// }

// const sizeMap = {
//   sm: "w-8 h-8 text-xs",
//   md: "w-10 h-10 text-sm",
//   lg: "w-12 h-12 text-base",
//   xl: "w-20 h-20 text-xl",
// };

// export const Avatar = ({
//   name,
//   src,
//   alt,
//   size = "md",
//   className,
// }: AvatarProps) => {
//   const [imgError, setImgError] = useState(false);
//   if (src && !imgError) {
//     return (
//       <img
//         src={src}
//         alt={alt || name}
//         onError={() => setImgError(true)}
//         className={cn(
//           "rounded-full object-cover shrink-0",
//           sizeMap[size],
//           className,
//         )}
//       />
//     );
//   }
//   const initials = getInitials(name);
//   const bgColor = stringToColor(name);

//   return (
//     <div
//       className={cn(
//         "rounded-full flex items-center justify-center font-medium text-white shrink-0 selection:bg-transparent",
//         sizeMap[size],
//         className,
//       )}
//       style={{ backgroundColor: bgColor }}
//       title={name}
//     >
//       {initials}
//     </div>
//   );
// };

