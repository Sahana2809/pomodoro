import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Timer from '../components/Timer';
import TaskCarrot from '../components/TaskCarrot';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Plus, Trash2, CheckCircle2, Circle, Play } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useTimer } from '../context/TimerContext';
import { cn } from '../lib/utils';

const Home = () => {
    const [newTask, setNewTask] = useState('');
    const [newDuration, setNewDuration] = useState(25);
    const { tasks, addTask, toggleTask, deleteTask } = useTasks();
    const { startTask, activeTaskId, timeLeft, isActive } = useTimer();

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTask.trim()) {
            addTask(newTask, newDuration);
            setNewTask('');
            setNewDuration(25);
        }
    };

    // Auto-complete task when timer finishes
    useEffect(() => {
        if (activeTaskId && timeLeft === 0 && !isActive) {
            toggleTask(activeTaskId);
            // activeTaskId will be cleared by resetTimer or switchMode, 
            // but we might want to explicitly clear it here or let the user do it.
            // For now, the timer logic in TimerContext handles the state reset.
        }
    }, [activeTaskId, timeLeft, isActive, toggleTask]);

    return (
        <div className="min-h-screen bg-pastel-cream pb-24">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-pastel-text mb-2">Focus Time</h1>
                    <p className="text-pastel-text/60">Let's get productive!</p>
                </header>

                <Timer />

                <TaskCarrot />

                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-pastel-text mb-4">Tasks</h2>

                    <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                        <Input
                            placeholder="Add a new task..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className="bg-white border-pastel-blue/20 focus:border-pastel-blue"
                        />
                        <Input
                            type="number"
                            placeholder="Min"
                            value={newDuration}
                            onChange={(e) => setNewDuration(parseInt(e.target.value) || 1)}
                            className="w-20 bg-white border-pastel-blue/20 focus:border-pastel-blue"
                            min="1"
                        />
                        <Button type="submit" className="bg-pastel-blue hover:bg-pastel-blue/90 text-white">
                            <Plus className="h-5 w-5" />
                        </Button>
                    </form>

                    <div className="space-y-3">
                        {tasks.map(task => (
                            <Card
                                key={task.id}
                                className={cn(
                                    "border-none shadow-sm transition-all duration-200",
                                    task.completed ? "bg-pastel-green/10" : "bg-white hover:shadow-md",
                                    activeTaskId === task.id && "ring-2 ring-pastel-mint"
                                )}
                            >
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <button
                                            onClick={() => toggleTask(task.id)}
                                            className="text-pastel-text/40 hover:text-pastel-mint transition-colors"
                                        >
                                            {task.completed ?
                                                <CheckCircle2 className="h-6 w-6 text-pastel-mint" /> :
                                                <Circle className="h-6 w-6" />
                                            }
                                        </button>
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "font-medium transition-all",
                                                task.completed && "text-pastel-text/40 line-through"
                                            )}>
                                                {task.title}
                                            </span>
                                            <span className="text-xs text-pastel-text/60">
                                                {task.duration} mins
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {!task.completed && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => startTask(task.duration * 60, task.id)}
                                                className={cn(
                                                    "text-pastel-blue hover:text-pastel-blue/80 hover:bg-pastel-blue/10",
                                                    activeTaskId === task.id && "bg-pastel-blue/10 text-pastel-blue"
                                                )}
                                            >
                                                <Play className="h-4 w-4 mr-1" />
                                                {activeTaskId === task.id ? "Focusing" : "Start"}
                                            </Button>
                                        )}
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="text-pastel-text/40 hover:text-red-400 transition-colors p-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {tasks.length === 0 && (
                            <div className="text-center py-8 text-pastel-text/40 border-2 border-dashed border-pastel-text/10 rounded-lg">
                                No tasks yet. Add one to get started!
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <NavBar />
        </div>
    );
};

export default Home;
