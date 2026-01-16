import { ArrowUp, ArrowDown, Minus, ExternalLink, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RadarModel } from "@shared/schema";

interface ModelCardProps {
  model: RadarModel;
  displayRank: number;
}

export function ModelCard({ model, displayRank }: ModelCardProps) {
  const formatNumber = (num: number) => num.toLocaleString();
  
  const formatChange = (num: number, suffix = "") => {
    if (num > 0) return `+${formatNumber(num)}${suffix}`;
    if (num < 0) return `${formatNumber(num)}${suffix}`;
    return `0${suffix}`;
  };

  const formatPct = (num: number) => {
    const pct = (num * 100).toFixed(1);
    if (num > 0) return `+${pct}%`;
    if (num < 0) return `${pct}%`;
    return "0%";
  };

  const getRankBadgeSize = () => {
    if (displayRank <= 3) return "h-10 w-10 text-base";
    if (displayRank <= 10) return "h-8 w-8 text-sm";
    return "h-7 w-7 text-xs";
  };

  const getRankBadgeStyle = () => {
    if (displayRank === 1) return "bg-yellow-500 text-yellow-950";
    if (displayRank === 2) return "bg-gray-400 text-gray-900";
    if (displayRank === 3) return "bg-amber-600 text-amber-50";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Card
      className="group relative overflow-visible p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      data-testid={`card-model-${model.id}`}
    >
      <div className={`absolute -left-3 -top-3 flex items-center justify-center rounded-full font-bold shadow-md ${getRankBadgeSize()} ${getRankBadgeStyle()}`}>
        {displayRank}
      </div>

      {model.isNew && (
        <Badge
          variant="outline"
          className="absolute -right-2 -top-2 border-positive bg-positive/10 text-positive"
        >
          <Sparkles className="mr-1 h-3 w-3" />
          신규
        </Badge>
      )}

      <div className="mb-4 pt-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {model.manufacturer}
        </p>
        <h3 className="mt-1 text-lg font-semibold leading-tight">{model.modelName}</h3>
      </div>

      <div className="mb-5">
        <p className="text-3xl font-bold tabular-nums tracking-tight">
          {formatNumber(model.sales)}
          <span className="ml-1 text-sm font-normal text-muted-foreground">대</span>
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium ${
            model.momAbs > 0
              ? "bg-positive/10 text-positive"
              : model.momAbs < 0
              ? "bg-negative/10 text-negative"
              : "bg-muted text-muted-foreground"
          }`}
          data-testid={`text-mom-abs-${model.id}`}
        >
          {model.momAbs > 0 ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : model.momAbs < 0 ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <Minus className="h-3.5 w-3.5" />
          )}
          {formatChange(model.momAbs, "대")}
        </div>

        <div
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium ${
            model.momPct > 0
              ? "bg-positive/10 text-positive"
              : model.momPct < 0
              ? "bg-negative/10 text-negative"
              : "bg-muted text-muted-foreground"
          }`}
          data-testid={`text-mom-pct-${model.id}`}
        >
          {formatPct(model.momPct)}
        </div>

        {model.rankChange !== 0 && (
          <div
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium ${
              model.rankChange > 0
                ? "bg-positive/10 text-positive"
                : "bg-negative/10 text-negative"
            }`}
            data-testid={`text-rank-change-${model.id}`}
          >
            {model.rankChange > 0 ? (
              <>
                <ArrowUp className="h-3.5 w-3.5" />
                {model.rankChange}위
              </>
            ) : (
              <>
                <ArrowDown className="h-3.5 w-3.5" />
                {Math.abs(model.rankChange)}위
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        <span>전월: {formatNumber(model.prevSales)}대</span>
        <span>
          {model.prevRank ? `${model.prevRank}위 → ${model.rank}위` : `${model.rank}위`}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="mt-4 w-full"
        asChild
        data-testid={`button-danawa-${model.id}`}
      >
        <a href={model.danawaUrl} target="_blank" rel="noopener noreferrer">
          다나와 원문 보기
          <ExternalLink className="ml-2 h-3.5 w-3.5" />
        </a>
      </Button>
    </Card>
  );
}
