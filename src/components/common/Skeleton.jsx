import { motion } from 'framer-motion';

export default function Skeleton({ className }) {
  return (
    <motion.div 
      className={`bg-surface-200 dark:bg-surface-800 rounded-lg ${className}`}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <motion.div 
      className="glass-card p-6 h-[120px] flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex items-center gap-3">
        <motion.div 
          className="w-10 h-10 rounded-xl bg-surface-200 dark:bg-surface-800"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="space-y-2">
          <motion.div 
            className="w-20 h-3 bg-surface-200 dark:bg-surface-800 rounded"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />
          <motion.div 
            className="w-12 h-2 bg-surface-200 dark:bg-surface-800 rounded"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
        </div>
      </div>
      <motion.div 
        className="w-24 h-6 mt-4 bg-surface-200 dark:bg-surface-800 rounded"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
    </motion.div>
  );
}

export function TableSkeleton() {
  return (
    <motion.div 
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i} 
            className="flex items-center justify-between py-2 border-b border-surface-100 dark:border-surface-700/50 last:border-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-9 h-9 rounded-xl bg-surface-200 dark:bg-surface-800"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="space-y-2">
                <motion.div 
                  className="w-32 h-4 bg-surface-200 dark:bg-surface-800 rounded"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.05 }}
                />
                <motion.div 
                  className="w-20 h-3 bg-surface-200 dark:bg-surface-800 rounded"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                />
              </div>
            </div>
            <motion.div 
              className="w-24 h-4 bg-surface-200 dark:bg-surface-800 rounded"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
            />
            <motion.div 
              className="w-16 h-6 rounded-lg bg-surface-200 dark:bg-surface-800"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.div 
              className="w-20 h-5 bg-surface-200 dark:bg-surface-800 rounded"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
