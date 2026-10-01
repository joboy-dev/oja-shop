import React, { type ReactNode } from "react";
import Link from "next/link";

type CardProps = {
  icon?: React.ReactNode;
  title?: string;
  backgroundColor?: string;
  description?: string;
  className?: string;
  linkTo?: string;
  children?: ReactNode
};

function Card({
  icon,
  title,
  description,
  backgroundColor = "bg-secondary/50",
  className = "",
  linkTo,
  children
}: CardProps) {
  return (
    <div
      className={`${backgroundColor} rounded-lg p-6 hover:shadow-sm transition-all duration-300 border-2 border-border ${className}`}
    >
      {linkTo && <Link href={linkTo}>
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary text-3xl mb-4">{icon}</div>}
          {title && <h3 className="text-2xl font-semibold mb-2 text-foreground max-md:text-lg">{title}</h3>}
        </div>
        {description && <p className="text-sm text-muted-foreground max-md:text-xs">{description}</p>}
      </Link>}

      {!linkTo && <div>
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary text-3xl mb-4">{icon}</div>}
          {title && <h3 className="text-xl font-semibold mb-2 text-foreground max-md:text-lg">{title}</h3>}
        </div>
        {description && <p className="text-sm text-muted-foreground max-md:text-xs">{description}</p>}
        <div>
          {children}
        </div>
      </div> }
    </div>
  );
}

export default Card;
