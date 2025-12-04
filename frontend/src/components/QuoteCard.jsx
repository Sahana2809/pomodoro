import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const QuoteCard = () => {
    const [quote, setQuote] = useState({ text: "Focus is the key to productivity.", author: "Anonymous" });

    // Mock API call
    useEffect(() => {
        const quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
            { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        ];
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    return (
        <div className="bg-white/60 p-4 rounded-lg border border-pastel-blue/30 shadow-sm max-w-md mx-auto mt-6">
            <div className="flex gap-2">
                <Quote className="h-6 w-6 text-pastel-purple shrink-0" />
                <div>
                    <p className="text-pastel-text italic font-medium">"{quote.text}"</p>
                    <p className="text-right text-xs text-pastel-text/60 mt-2">- {quote.author}</p>
                </div>
            </div>
        </div>
    );
};

export default QuoteCard;
