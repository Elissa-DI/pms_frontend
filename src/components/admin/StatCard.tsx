import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import { cva } from "class-variance-authority";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "primary" | "success" | "warning" | "danger" | "info";
}

const cardVariants = cva("transition-all duration-200 hover:scale-[1.02]", {
  variants: {
    variant: {
      primary: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
      success: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white",
      warning: "bg-gradient-to-br from-amber-500 to-amber-600 text-white",
      danger: "bg-gradient-to-br from-rose-500 to-rose-600 text-white",
      info: "bg-gradient-to-br from-sky-500 to-sky-600 text-white",
    }
  },
  defaultVariants: {
    variant: "primary"
  }
});

const iconVariants = cva("rounded-full p-2 flex items-center justify-center", {
  variants: {
    variant: {
      primary: "bg-blue-400/30",
      success: "bg-emerald-400/30",
      warning: "bg-amber-400/30",
      danger: "bg-rose-400/30",
      info: "bg-sky-400/30",
    }
  },
  defaultVariants: {
    variant: "primary"
  }
});

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  variant = "primary",
}: StatCardProps) {
  return (
    <Card className={cardVariants({ variant })}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">{title}</p>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-bold">{value}</p>
              {trend && trendValue && (
                <span className={`ml-2 text-xs font-medium ${
                  trend === "up" ? "text-emerald-200" : 
                  trend === "down" ? "text-rose-200" : "text-opacity-70"
                }`}>
                  {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
                </span>
              )}
            </div>
            {description && <p className="mt-1 text-xs opacity-80">{description}</p>}
          </div>
          <div className={iconVariants({ variant })}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}