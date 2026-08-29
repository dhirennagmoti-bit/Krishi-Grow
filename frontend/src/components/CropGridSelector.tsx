import React from 'react';
import { CROP_CATALOG, type CropItem } from '../data/cropCatalog';
import { Check } from 'lucide-react';

interface CropGridSelectorProps {
  selectedCrop: string;
  onSelectCrop: (cropName: string) => void;
  className?: string;
}

export const CropGridSelector: React.FC<CropGridSelectorProps> = ({
  selectedCrop,
  onSelectCrop,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between px-1">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
          Select Crop ({CROP_CATALOG.length} Available)
        </label>
        <span className="text-xs text-emerald-400 font-semibold">
          Active: <strong className="text-white">{selectedCrop}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        {CROP_CATALOG.map((crop: CropItem) => {
          const isSelected = selectedCrop.toLowerCase() === crop.name.toLowerCase() ||
                             (crop.name.includes('/') && selectedCrop.toLowerCase().includes(crop.id));

          return (
            <button
              key={crop.id}
              type="button"
              onClick={() => onSelectCrop(crop.name)}
              className={`relative aspect-[1/1.15] rounded-xl p-4 flex flex-col items-center justify-between transition-all duration-200 group border text-left cursor-pointer overflow-hidden ${
                isSelected
                  ? 'border-2 border-emerald-500 bg-[#16291d] shadow-[0_0_25px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/50 scale-[1.02]'
                  : 'bg-[#1b1816]/90 hover:bg-[#25211c] border-white/10 hover:border-white/25 shadow-md hover:scale-[1.01]'
              }`}
            >
              {/* Checkmark Indicator for selected tile */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Crop Visual Icon / Image */}
              <div className="flex-1 flex items-center justify-center w-full py-2">
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {/* Subtle dark ambient glow behind graphic */}
                  <div className="absolute inset-0 rounded-full bg-black/40 blur-xs" />
                  
                  {/* High quality image fallback to crisp emoji badge */}
                  <img
                    src={crop.iconUrl}
                    alt={crop.name}
                    className="w-full h-full object-cover rounded-xl relative z-10 shadow-md border border-white/10 group-hover:border-emerald-400/40"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Replace the src with a generated SVG data URI containing the emoji, avoiding DOM mutation bugs
                      if (!target.src.startsWith('data:image/svg+xml')) {
                        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="55%" font-size="65" text-anchor="middle" dominant-baseline="middle">${crop.emoji}</text></svg>`;
                        target.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Crop Label */}
              <span className={`text-xs font-bold tracking-wide text-center transition-colors line-clamp-1 ${
                isSelected ? 'text-emerald-300' : 'text-gray-100 group-hover:text-white'
              }`}>
                {crop.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
