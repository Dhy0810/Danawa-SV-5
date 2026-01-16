import { TrendingUp, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "./theme-toggle";
import type { Nation } from "@shared/schema";

interface DashboardHeaderProps {
  selectedMonth: string;
  selectedNation: Nation;
  availableMonths: string[];
  onMonthChange: (month: string) => void;
  onNationChange: (nation: Nation) => void;
  lastUpdated?: string;
}

export function DashboardHeader({
  selectedMonth,
  selectedNation,
  availableMonths,
  onMonthChange,
  onNationChange,
  lastUpdated,
}: DashboardHeaderProps) {
  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    return `${year}년 ${parseInt(monthNum)}월`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold leading-tight">판매 레이더</h1>
                <p className="hidden text-xs text-muted-foreground sm:block">급상승 모델 추적</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
              <Button
                variant={selectedNation === "domestic" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onNationChange("domestic")}
                className="text-xs font-medium"
                data-testid="button-nation-domestic"
              >
                국산
              </Button>
              <Button
                variant={selectedNation === "import" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onNationChange("import")}
                className="text-xs font-medium"
                data-testid="button-nation-import"
              >
                수입
              </Button>
            </div>

            <Select value={selectedMonth} onValueChange={onMonthChange}>
              <SelectTrigger className="w-[130px] sm:w-[150px]" data-testid="select-month">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="월 선택" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month} data-testid={`option-month-${month}`}>
                    {formatMonth(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ThemeToggle />
          </div>
        </div>

        {lastUpdated && (
          <div className="flex items-center justify-end pb-2 text-xs text-muted-foreground">
            <span>마지막 업데이트: {lastUpdated}</span>
          </div>
        )}
      </div>
    </header>
  );
}
