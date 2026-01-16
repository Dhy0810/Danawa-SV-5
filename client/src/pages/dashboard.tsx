import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard-header";
import { FilterBar } from "@/components/filter-bar";
import { ModelCard } from "@/components/model-card";
import { ModelCardSkeletonGrid } from "@/components/model-card-skeleton";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import type { Nation, RadarResponse, FilterOptions, AvailableMonths } from "@shared/schema";

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedNation, setSelectedNation] = useState<Nation>("domestic");
  const [filters, setFilters] = useState<FilterOptions>({
    minSales: 300,
    excludeNewEntries: false,
    limit: 20,
  });

  const {
    data: monthsData,
    isLoading: isLoadingMonths,
  } = useQuery<AvailableMonths>({
    queryKey: ["/api/months"],
  });

  const availableMonths = monthsData?.months || [];
  const latestMonth = monthsData?.latestMonth || "";

  const currentMonth = selectedMonth || latestMonth;

  const {
    data: radarData,
    isLoading: isLoadingRadar,
    error: radarError,
    refetch: refetchRadar,
  } = useQuery<RadarResponse>({
    queryKey: [`/api/radar?month=${currentMonth}&nation=${selectedNation}`],
    enabled: !!currentMonth,
  });

  const filteredModels = useMemo(() => {
    if (!radarData?.models) return [];
    
    return radarData.models
      .filter((model) => {
        if (model.sales < filters.minSales) return false;
        if (filters.excludeNewEntries && model.isNew) return false;
        return true;
      })
      .slice(0, filters.limit);
  }, [radarData?.models, filters]);

  const totalCount = radarData?.models?.length || 0;
  const isLoading = isLoadingMonths || isLoadingRadar;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        selectedMonth={currentMonth}
        selectedNation={selectedNation}
        availableMonths={availableMonths}
        onMonthChange={setSelectedMonth}
        onNationChange={setSelectedNation}
        lastUpdated={radarData?.lastUpdated}
      />

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        totalCount={totalCount}
        filteredCount={filteredModels.length}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <ModelCardSkeletonGrid />
        ) : radarError ? (
          <ErrorState onRetry={() => refetchRadar()} />
        ) : filteredModels.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="model-grid">
            {filteredModels.map((model, index) => (
              <ModelCard
                key={model.id}
                model={model}
                displayRank={index + 1}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredModels.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              데이터 출처:{" "}
              <a
                href={`https://auto.danawa.com/auto/?Work=record&Tab=Model&Nation=${
                  selectedNation === "domestic" ? "domestic" : "export"
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
                data-testid="link-danawa-source"
              >
                다나와 자동차
              </a>
            </p>
            <p className="mt-1 text-xs">
              본 서비스는 KAMA/KAIDA 공식 자료를 기반으로 한 파생 지표를 제공합니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
