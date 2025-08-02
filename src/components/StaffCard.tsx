import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface StaffCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  variant?: "primary" | "secondary" | "accent" | "destructive";
}

export const StaffCard = ({ title, description, icon, route, variant = "primary" }: StaffCardProps) => {
  const navigate = useNavigate();

  const variantClasses = {
    primary: "staff-card",
    secondary: "staff-card secondary",
    accent: "staff-card accent", 
    destructive: "staff-card destructive"
  };

  return (
    <div 
      className={cn(variantClasses[variant], "group")}
      onClick={() => navigate(route)}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="font-bold text-xl text-foreground transition-all duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};