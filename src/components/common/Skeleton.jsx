export default function Skeleton({ className }) {
  return (
    <div 
      className={`animate-pulse bg-surface-200 dark:bg-surface-800 rounded-lg ${className}`}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card p-6 h-[120px] flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="w-20 h-3" />
          <Skeleton className="w-12 h-2" />
        </div>
      </div>
      <Skeleton className="w-24 h-6 mt-4" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-surface-100 dark:border-surface-700/50 last:border-0">
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-20 h-3" />
              </div>
            </div>
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-16 h-6 rounded-lg" />
            <Skeleton className="w-20 h-5" />
          </div>
        ))}
      </div>
    </div>
  );
}
