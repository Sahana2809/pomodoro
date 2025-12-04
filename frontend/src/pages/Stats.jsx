import React from 'react';
import NavBar from '../components/NavBar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Stats = () => {
    // Mock data
    const data = [
        { name: 'Mon', focus: 120 },
        { name: 'Tue', focus: 150 },
        { name: 'Wed', focus: 180 },
        { name: 'Thu', focus: 90 },
        { name: 'Fri', focus: 200 },
        { name: 'Sat', focus: 60 },
        { name: 'Sun', focus: 30 },
    ];

    const totalFocusTime = data.reduce((acc, curr) => acc + curr.focus, 0);
    const completedTasks = 12; // Mock

    return (
        <div className="min-h-screen bg-pastel-blue/10 pb-24">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-3xl font-bold text-pastel-text mb-6">Your Progress</h1>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Card className="bg-white/60 border-pastel-pink/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-pastel-text/60">Total Focus Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-pastel-text">{Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/60 border-pastel-mint/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-pastel-text/60">Tasks Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-pastel-text">{completedTasks}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-white/80 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg text-pastel-text">Weekly Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}m`} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="focus" radius={[4, 4, 0, 0]}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#FFB7B2' : '#B5EAD7'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <NavBar />
        </div>
    );
};

export default Stats;
