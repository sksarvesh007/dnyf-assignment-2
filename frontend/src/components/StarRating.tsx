import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StarRatingProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

export function StarRating({ value, onChange, disabled }: StarRatingProps) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onChange(star)}
                    onMouseEnter={() => !disabled && setHoverValue(star)}
                    onMouseLeave={() => !disabled && setHoverValue(null)}
                    disabled={disabled}
                    className="focus:outline-none"
                >
                    <Star
                        className={cn(
                            "w-8 h-8 transition-colors duration-200",
                            (hoverValue ?? value) >= star
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-transparent text-muted-foreground"
                        )}
                    />
                </motion.button>
            ))}
        </div>
    );
}
