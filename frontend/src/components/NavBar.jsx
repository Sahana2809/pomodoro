import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const NavBar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/stats', icon: BarChart2, label: 'Stats' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-pastel-blue/30 rounded-full shadow-lg px-6 py-3 flex items-center space-x-2 z-50">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                    <Link key={item.path} to={item.path}>
                        <div className={cn(
                            "p-3 rounded-full transition-all duration-300",
                            isActive ? "bg-pastel-pink text-white shadow-md" : "text-pastel-text hover:bg-pastel-blue/20"
                        )}>
                            <Icon className="h-6 w-6" />
                            <span className="sr-only">{item.label}</span>
                        </div>
                    </Link>
                );
            })}
            <div className="w-px h-8 bg-pastel-blue/30 mx-2" />
            <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-pastel-text hover:bg-pastel-pink/20 hover:text-pastel-pink rounded-full"
            >
                <LogOut className="h-5 w-5" />
            </Button>
        </nav>
    );
};

export default NavBar;
