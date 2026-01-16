import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ModelCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="mb-4 pt-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-5 w-32" />
      </div>

      <div className="mb-5">
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="mb-5 flex gap-2">
        <Skeleton className="h-7 w-16 rounded-md" />
        <Skeleton className="h-7 w-14 rounded-md" />
        <Skeleton className="h-7 w-12 rounded-md" />
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>

      <Skeleton className="mt-4 h-8 w-full" />
    </Card>
  );
}

export function ModelCardSkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <ModelCardSkeleton key={i} />
      ))}
    </div>
  );
}
