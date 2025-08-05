import React from "react";

interface SkeletonLoaderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  variant?: "text" | "rectangular" | "circular";
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = "",
  width = "100%",
  height = "1rem",
  rounded = "md",
  variant = "rectangular",
}) => {
  const baseClasses = "bg-gray-200 animate-pulse";
  
  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const variantClasses = {
    text: "h-4",
    rectangular: "",
    circular: "rounded-full",
  };

  const combinedClasses = [
    baseClasses,
    roundedClasses[rounded],
    variantClasses[variant],
    className,
  ].filter(Boolean).join(" ");

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return <div className={combinedClasses} style={style} />;
};

// Skeleton components for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = "",
}) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, index) => (
      <SkeletonLoader
        key={index}
        height="1rem"
        width={index === lines - 1 ? "75%" : "100%"}
        variant="text"
      />
    ))}
  </div>
);

export const SkeletonImage: React.FC<{
  width?: string | number;
  height?: string | number;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait";
}> = ({ width, height, className = "", aspectRatio }) => {
  let aspectClass = "";
  if (aspectRatio === "square") aspectClass = "aspect-square";
  if (aspectRatio === "video") aspectClass = "aspect-video";
  if (aspectRatio === "portrait") aspectClass = "aspect-[3/4]";

  return (
    <SkeletonLoader
      width={width}
      height={height}
      className={`${aspectClass} ${className}`}
      rounded="lg"
    />
  );
};

export const SkeletonButton: React.FC<{
  width?: string | number;
  height?: string | number;
  className?: string;
}> = ({ width = "auto", height = "2.5rem", className = "" }) => (
  <SkeletonLoader
    width={width}
    height={height}
    className={className}
    rounded="md"
  />
);

export const SkeletonAvatar: React.FC<{
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <SkeletonLoader
      className={`${sizeClasses[size]} ${className}`}
      rounded="full"
    />
  );
};

export const SkeletonCard: React.FC<{
  hasImage?: boolean;
  hasTitle?: boolean;
  hasDescription?: boolean;
  hasButton?: boolean;
  className?: string;
}> = ({
  hasImage = true,
  hasTitle = true,
  hasDescription = true,
  hasButton = true,
  className = "",
}) => (
  <div className={`bg-white rounded-lg shadow-sm border overflow-hidden ${className}`}>
    {hasImage && <SkeletonImage aspectRatio="square" />}
    <div className="p-4 space-y-3">
      {hasTitle && <SkeletonText lines={1} />}
      {hasDescription && <SkeletonText lines={2} />}
      {hasButton && <SkeletonButton height="2rem" />}
    </div>
  </div>
);

export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    {/* Table Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {[...Array(columns)].map((_, index) => (
        <SkeletonLoader key={index} height="1.5rem" />
      ))}
    </div>
    
    {/* Table Rows */}
    {[...Array(rows)].map((_, rowIndex) => (
      <div
        key={rowIndex}
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {[...Array(columns)].map((_, colIndex) => (
          <SkeletonLoader key={colIndex} height="1rem" />
        ))}
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
