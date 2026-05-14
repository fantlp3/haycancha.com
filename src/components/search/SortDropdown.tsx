import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_LABELS, type SortKey } from "@/lib/sort-clubs";

interface Props {
  value: SortKey;
  onChange: (next: SortKey) => void;
  className?: string;
}

const ORDER: SortKey[] = ["relevancia", "cercano", "nombre", "canchas"];

/**
 * Compact sort selector for /canchas. Uses shadcn/Radix Select so it portals
 * above the filters Sheet without z-index fights, and stays keyboard-accessible
 * out of the box.
 */
export const SortDropdown = ({ value, onChange, className }: Props) => (
  <Select value={value} onValueChange={(v) => onChange(v as SortKey)}>
    <SelectTrigger className={className ?? "h-10 gap-2 border-border min-w-[160px]"}>
      <ArrowUpDown size={14} className="text-gray shrink-0" />
      <SelectValue placeholder="Ordenar" />
    </SelectTrigger>
    <SelectContent>
      {ORDER.map((k) => (
        <SelectItem key={k} value={k}>
          {SORT_LABELS[k]}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
