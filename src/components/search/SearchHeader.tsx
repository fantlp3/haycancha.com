import { Search as SearchIcon } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  resultsLabel: string;
}

export const SearchHeader = ({ value, onChange, resultsLabel }: Props) => (
  <div className="bg-white border-b border-border p-4 space-y-2">
    <div className="relative">
      <SearchIcon
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-orange pointer-events-none"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Barrio, ciudad o nombre del club..."
        className="w-full h-11 pl-10 pr-3 rounded-md bg-white border-2 border-border text-dark placeholder:text-gray text-[14px] font-medium transition-all focus:outline-none focus:border-orange focus:shadow-focus-orange"
      />
    </div>
    <p className="text-[13px] text-gray">{resultsLabel}</p>
  </div>
);
