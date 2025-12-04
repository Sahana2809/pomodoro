import React from 'react';
import { useTimer } from '../context/TimerContext';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const Timer = () => {
    const { timeLeft, isActive, startTimer, pauseTimer, resetTimer, mode, switchMode } = useTimer();

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="flex space-x-2 bg-white/50 p-1 rounded-lg">
                {['pomodoro', 'shortBreak', 'longBreak'].map((m) => (
                    <button
                        key={m}
                        onClick={() => switchMode(m)}
                        className={cn(
                            "px-4 py-2 rounded-md text-sm font-medium transition-all",
                            mode === m
                                ? "bg-pastel-pink text-white shadow-sm"
                                : "text-pastel-text hover:bg-pastel-pink/20"
                        )}
                    >
                        {m === 'pomodoro' ? 'Pomodoro' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
                    </button>
                ))}
            </div>

            <div className="text-8xl font-bold text-pastel-text tracking-wider font-mono">
                {formatTime(timeLeft)}
            </div>

            <div className="flex space-x-4">
                {!isActive ? (
                    <Button
                        onClick={startTimer}
                        className="w-32 h-12 text-lg bg-pastel-mint hover:bg-pastel-mint/90 text-pastel-text border-2 border-pastel-mint"
                    >
                        <Play className="mr-2 h-5 w-5" /> Start
                    </Button>
                ) : (
                    <Button
                        onClick={pauseTimer}
                        className="w-32 h-12 text-lg bg-pastel-pink hover:bg-pastel-pink/90 text-white border-2 border-pastel-pink"
                    >
                        <Pause className="mr-2 h-5 w-5" /> Pause
                    </Button>
                )}
                <Button
                    variant="outline"
                    onClick={resetTimer}
                    className="h-12 w-12 p-0 border-2 border-pastel-blue text-pastel-blue hover:bg-pastel-blue/10"
                >
                    <RotateCcw className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

export default Timer;
