import { Search } from "lucide-react";

export const SearchBar = () => (
  <div className="group relative w-full">
    <Search
      size={20}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-orange pointer-events-none"
    />
    <input
      type="text"
      placeholder="Buscar por barrio, ciudad o nombre..."
      className="w-full h-12 md:h-14 pl-12 pr-4 rounded-lg bg-white border-2 border-border text-dark placeholder:text-gray text-[15px] font-medium transition-all focus:outline-none focus:border-orange focus:shadow-focus-orange focus:placeholder:text-transparent"
    />
  </div>
);
