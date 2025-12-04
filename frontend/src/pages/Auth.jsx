import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        if (isLogin) {
            await login(email, password);
        } else {
            await signup(email, password);
        }
        navigate('/');
    } catch (error) {
        alert(error.message);   // Shows Firebase error
        console.error("Auth error:", error);
    } finally {
        setLoading(false);
    }
};


    return (
        <div className="min-h-screen flex items-center justify-center bg-pastel-blue/20 p-4">
            <Card className="w-full max-w-md border-pastel-pink/50 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-pastel-text">
                        {isLogin ? 'Welcome Back' : 'Create an Account'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isLogin ? 'Enter your credentials to access your focus space' : 'Start your productivity journey today'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="border-pastel-purple focus-visible:ring-pastel-purple"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="border-pastel-purple focus-visible:ring-pastel-purple"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-pastel-pink hover:bg-pastel-pink/90 text-white font-semibold"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        variant="link"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-pastel-text/70 hover:text-pastel-text"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Auth;
