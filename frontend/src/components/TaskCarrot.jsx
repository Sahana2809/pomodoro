import React from 'react';
import { motion } from 'framer-motion';
import { useTimer } from '../context/TimerContext';
import { cn } from '../lib/utils';

const TaskCarrot = () => {
    const { progress } = useTimer();
    const isCompleted = progress >= 100;

    return (
        <div className="w-full max-w-md mx-auto my-8">
            <div className="relative h-24 bg-pastel-mint/30 rounded-full overflow-hidden border-2 border-pastel-mint">
                {/* Grass/Ground */}
                <div className="absolute bottom-0 w-full h-2 bg-pastel-mint/50" />

                {/* Carrot at the end */}
                <div
                    className={cn(
                        "absolute right-4 top-1/2 -translate-y-1/2 text-3xl transition-all duration-500",
                        isCompleted ? "opacity-0 scale-0" : "opacity-100 scale-100"
                    )}
                >
                    🥕
                </div>

                {/* Rabbit */}
                <motion.div
                    className="absolute top-1/2 z-10 -translate-y-1/2"
                    style={{
                        left: `${Math.min(progress, 85)}%`,
                    }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 50 }}
                >
                    <div className="text-7xl transform -scale-x-100 pb-4">
                        🐇
                    </div>
                </motion.div>
            </div>
            <p className="text-center text-sm text-pastel-text/60 mt-4 font-medium">
                {isCompleted ? "Yum! Task completed!" : "Keep focusing to reach the carrot!"}
            </p>
        </div>
    );
};

export default TaskCarrot;
