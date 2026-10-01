import React from "react";
import clsx from "clsx";

type AvatarProps = {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  rounded?: "full" | "md" | "none";
  className?: string;
  showBadge?: boolean;
  badgeColor?: string;
  onClick?: () => void
};

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-lg",
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name = "",
  size = "md",
  rounded = "full",
  className = "",
  showBadge = false,
  badgeColor = "bg-green-500",
  onClick
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative inline-block" onClick={onClick}>
      <div
        className={clsx(
          "flex items-center justify-center bg-muted text-white font-semibold",
          sizeClasses[size],
          rounded === "full" ? "rounded-full" : rounded === "md" ? "rounded-md" : "",
          className
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className={clsx("object-cover w-full h-full", rounded === "full" ? "rounded-full" : rounded === "md" ? "rounded-md" : "")}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {showBadge && (
        <span
          className={clsx(
            "absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full",
            badgeColor
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
