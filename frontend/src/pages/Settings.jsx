import React from 'react';
import NavBar from '../components/NavBar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

import { useTimer } from '../context/TimerContext';
import { useState, useEffect } from 'react';

const Settings = () => {
    const { user } = useAuth();
    const { modes, updateModes } = useTimer();
    const [localModes, setLocalModes] = useState({
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15
    });

    useEffect(() => {
        if (modes) {
            setLocalModes({
                pomodoro: Math.floor(modes.pomodoro / 60),
                shortBreak: Math.floor(modes.shortBreak / 60),
                longBreak: Math.floor(modes.longBreak / 60)
            });
        }
    }, [modes]);

    const handleSave = () => {
        updateModes({
            pomodoro: localModes.pomodoro * 60,
            shortBreak: localModes.shortBreak * 60,
            longBreak: localModes.longBreak * 60
        });
        // Optional: Add toast notification here
    };

    return (
        <div className="min-h-screen bg-pastel-blue/10 pb-24">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-3xl font-bold text-pastel-text mb-6">Settings</h1>

                <div className="space-y-6">
                    <Card className="bg-white/80 border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg text-pastel-text">Account</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-pastel-text/80">Email</span>
                                <span className="text-sm text-pastel-text/60">{user?.email}</span>
                            </div>
                            <Button variant="outline" className="w-full text-red-400 hover:text-red-500 hover:bg-red-50 border-red-100">
                                Delete Account
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg text-pastel-text">Timer Settings (Minutes)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-pastel-text/60">Pomodoro</label>
                                    <Input
                                        type="number"
                                        value={localModes.pomodoro}
                                        onChange={(e) => setLocalModes({ ...localModes, pomodoro: parseInt(e.target.value) || 0 })}
                                        className="bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-pastel-text/60">Short Break</label>
                                    <Input
                                        type="number"
                                        value={localModes.shortBreak}
                                        onChange={(e) => setLocalModes({ ...localModes, shortBreak: parseInt(e.target.value) || 0 })}
                                        className="bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-pastel-text/60">Long Break</label>
                                    <Input
                                        type="number"
                                        value={localModes.longBreak}
                                        onChange={(e) => setLocalModes({ ...localModes, longBreak: parseInt(e.target.value) || 0 })}
                                        className="bg-white"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleSave}
                                className="w-full bg-pastel-mint hover:bg-pastel-mint/90 text-pastel-text"
                            >
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg text-pastel-text">Appearance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-pastel-text/80">Dark Mode</span>
                                <div className="h-6 w-11 bg-gray-200 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm transition-transform" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <NavBar />
        </div>
    );
};

export default Settings;
