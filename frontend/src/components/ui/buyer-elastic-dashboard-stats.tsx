import { cn } from "../../lib/utils";
import { ArrowUpRight, Sprout, Warehouse, Clock, TrendingUp, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface ElasticStatProps {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  src: string;
  alt: string;
  icon: React.ReactNode;
  action?: string;
  onClickAction?: () => void;
}

interface Props {
  requirementsCount: number;
  availableFarmersCount: number;
  pendingRequestsCount: number;
  onViewRequirementsClick?: () => void;
  onViewFarmersClick?: () => void;
  onViewRequestsClick?: () => void;
}

export function BuyerElasticDashboardStats({
  requirementsCount,
  availableFarmersCount,
  pendingRequestsCount,
  onViewRequirementsClick,
  onViewFarmersClick,
  onViewRequestsClick
}: Props) {
  const items: ElasticStatProps[] = [
    {
      id: "01",
      category: "Active Requirements",
      title: `${requirementsCount} Direct Posts`,
      subtitle: "Tomato, Onion & Cotton",
      src: "https://loremflickr.com/1000/800/warehouse,inventory?random=5",
      alt: "Active Requirements",
      icon: <Warehouse className="w-5 h-5" />,
      action: "View Posts",
      onClickAction: onViewRequirementsClick
    },
    {
      id: "02",
      category: "Available Farmers",
      title: `${availableFarmersCount} Farm Batches`,
      subtitle: "Within 150 km Radius",
      src: "https://loremflickr.com/1000/800/crops,farm?random=6",
      alt: "Available Farmers",
      icon: <Sprout className="w-5 h-5" />,
      action: "Find Farmers",
      onClickAction: onViewFarmersClick
    },
    {
      id: "03",
      category: "Pending Connection Requests",
      title: `${pendingRequestsCount} Requests`,
      subtitle: "Awaiting Farmer Payout Contact",
      src: "https://loremflickr.com/1000/800/handshake,business?random=7",
      alt: "Pending Connection Requests",
      icon: <TrendingUp className="w-5 h-5" />,
      action: "View Requests",
      onClickAction: onViewRequestsClick
    }
  ];

  const [activeId, setActiveId] = useState<string | null>("01");

  return (
    <div className="w-full">
      <div className="flex h-[350px] w-full flex-col gap-2 md:h-[280px] md:flex-row md:gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setActiveId(item.id)}
            onClick={() => setActiveId(item.id)}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-950",
              "transition-[flex,filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
              activeId === item.id ? "flex-[4]" : "flex-[1]",
              activeId === item.id
                ? "brightness-100"
                : "brightness-75 hover:brightness-90"
            )}
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 h-full w-full">
              <img
                src={item.src}
                alt={item.alt}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-1000",
                  activeId === item.id ? "scale-100" : "scale-110"
                )}
              />
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 transition-opacity duration-500",
                  activeId === item.id ? "opacity-100" : "opacity-80"
                )}
              />
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
              
              {/* Top Icon / Category when inactive (Horizontal) */}
              <div className={cn(
                "absolute top-4 left-4 right-4 flex items-center justify-center transition-all duration-500",
                activeId === item.id ? "opacity-0" : "opacity-100"
              )}>
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                  {item.icon}
                </div>
              </div>

              {/* Active Content */}
              <div
                className={cn(
                  "flex flex-col gap-1 transition-all duration-500",
                  activeId === item.id
                    ? "translate-y-0 opacity-100 delay-200"
                    : "translate-y-12 opacity-0"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full border border-white/30 bg-white/20 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md md:px-3 md:text-xs">
                    {item.category}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center ml-auto border border-white/10">
                    {item.icon}
                  </div>
                </div>

                <h3 className="text-xl md:text-3xl font-extrabold uppercase leading-none text-white font-mono">
                  {item.title}
                </h3>
                
                <p className="text-sm font-medium text-white/80 flex items-center gap-1.5 mt-1">
                  {item.id === "01" && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  {item.subtitle}
                </p>

                {item.action && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onClickAction?.();
                    }}
                    className="mt-3 flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-widest text-agri-300 hover:text-white transition-colors"
                  >
                    {item.action} <ArrowUpRight className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Inactive Content: Vertical Text */}
              <div
                className={cn(
                  "absolute transition-all duration-500 bottom-6 left-1/2 -translate-x-1/2",
                  activeId === item.id
                    ? "opacity-0 scale-50"
                    : "opacity-100 delay-500"
                )}
              >
                <span className="hidden whitespace-nowrap text-sm font-bold uppercase tracking-widest text-white [writing-mode:vertical-rl] md:block rotate-180">
                  {item.category}
                </span>
                <span className="block text-xs font-bold text-white md:hidden">
                  {item.id}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
