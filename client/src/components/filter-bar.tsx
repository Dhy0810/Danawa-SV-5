import { SlidersHorizontal } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { FilterOptions } from "@shared/schema";

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  totalCount: number;
  filteredCount: number;
}

export function FilterBar({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  return (
    <div className="border-b bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <span>필터</span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-3">
                <Label htmlFor="min-sales" className="whitespace-nowrap text-sm">
                  최소 판매량
                </Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="min-sales"
                    value={[filters.minSales]}
                    onValueChange={([value]) =>
                      onFiltersChange({ ...filters, minSales: value })
                    }
                    min={0}
                    max={1000}
                    step={50}
                    className="w-[120px] sm:w-[160px]"
                    data-testid="slider-min-sales"
                  />
                  <span className="w-14 text-right text-sm font-medium tabular-nums">
                    {filters.minSales.toLocaleString()}대
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="exclude-new"
                  checked={filters.excludeNewEntries}
                  onCheckedChange={(checked) =>
                    onFiltersChange({ ...filters, excludeNewEntries: checked === true })
                  }
                  data-testid="checkbox-exclude-new"
                />
                <Label
                  htmlFor="exclude-new"
                  className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  신규 진입 제외
                </Label>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground" data-testid="text-filtered-count">
              {filteredCount}
            </span>
            <span> / {totalCount} 모델</span>
          </div>
        </div>
      </div>
    </div>
  );
}
