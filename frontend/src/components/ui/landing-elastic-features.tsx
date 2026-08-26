import { cn } from "../../lib/utils";
import { ArrowUpRight, Truck, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import FoldText from "./FoldText";
import { useApp } from "../../context/AppContext";

interface ElasticFeatureProps {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  src: string;
  alt: string;
  icon: React.ReactNode;
  action: string;
  onClickAction: () => void;
}

export function LandingElasticFeatures() {
  const { setActiveTab } = useApp();
  
  const items: ElasticFeatureProps[] = [
    {
      id: "01",
      category: "Transport Cost Calculator",
      title: "Calculate exact freight charges",
      subtitle: "Route distance, vehicle capacity (1T to 24T reefer), toll taxes, and cost per kg for any destination.",
      src: "https://loremflickr.com/1000/800/truck,logistics?random=10",
      alt: "Transport Logistics",
      icon: <Truck className="w-5 h-5" />,
      action: "Launch Calculator",
      onClickAction: () => setActiveTab('solutions')
    },
    {
      id: "02",
      category: "AI Value-Add Products",
      title: "Discover manufacturing ops",
      subtitle: "Like Tomato Puree, Onion Flakes, and Cotton Seed Oil with score & margin predictions.",
      src: "https://loremflickr.com/1000/800/factory,technology?random=11",
      alt: "AI Value Add",
      icon: <Sparkles className="w-5 h-5" />,
      action: "View Recommendations",
      onClickAction: () => setActiveTab('solutions')
    },
    {
      id: "03",
      category: "90%+ Matchmaking Engine",
      title: "Smart buyer matching links",
      subtitle: "Crop variety, harvest dates, and location with verified Aggregators, Processors, and Wholesalers.",
      src: "https://loremflickr.com/1000/800/business,handshake?random=12",
      alt: "Matchmaking",
      icon: <Users className="w-5 h-5" />,
      action: "Find Buyers",
      onClickAction: () => setActiveTab('buyer-connections')
    },
  ];

  const [activeId, setActiveId] = useState<string | null>("01");

  return (
    <div className="w-full">
      <div className="flex h-[450px] w-full flex-col gap-2 md:h-[350px] md:flex-row md:gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setActiveId(item.id)}
            onClick={() => setActiveId(item.id)}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-xl backdrop-blur-md",
              "transition-[flex,filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
              activeId === item.id ? "flex-[4]" : "flex-[1]",
              activeId === item.id
                ? "brightness-100"
                : "brightness-75 hover:brightness-100"
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
                  "absolute inset-0 transition-opacity duration-700",
                  activeId === item.id
                    ? "bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100"
                    : "bg-black/60 opacity-0 md:opacity-100"
                )}
              />
            </div>

            {/* Vertical Compact View (Default on desktop when collapsed) */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity duration-500",
                activeId === item.id ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
            >
              <div className="rounded-full bg-white/20 p-3 text-white backdrop-blur-md mb-3">
                {item.icon}
              </div>
              <h3 className="hidden md:block origin-left -rotate-90 whitespace-nowrap text-lg font-bold tracking-wider text-white">
                <FoldText text={item.category} splitBy="word" trigger="hover" color="inherit" />
              </h3>
              <h3 className="md:hidden text-lg font-bold tracking-wider text-white text-center">
                <FoldText text={item.category} splitBy="word" trigger="hover" color="inherit" />
              </h3>
            </div>

            {/* Expanded Content View */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col justify-between p-6 md:p-8 transition-opacity duration-700 delay-100",
                activeId === item.id ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              {/* Top - Category Tag */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md">
                  {item.icon}
                </div>
                <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wider text-white backdrop-blur-md uppercase">
                  <FoldText text={item.category} trigger="scroll" splitBy="word" />
                </div>
              </div>

              {/* Bottom - Info & Action */}
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                  <FoldText text={item.title} trigger="scroll" splitBy="word" color="inherit" />
                </h2>
                <p className="text-sm md:text-base text-gray-200 line-clamp-2 mb-2 max-w-lg">
                  <FoldText text={item.subtitle} trigger="scroll" splitBy="word" color="inherit" />
                </p>

                {item.action && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onClickAction();
                    }}
                    className="self-start mt-2 inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md hover:bg-white/30 transition-colors"
                  >
                    <span><FoldText text={item.action} trigger="hover" splitBy="word" /></span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
