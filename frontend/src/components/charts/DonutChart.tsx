"use client";

interface Segment {
    label: string;
    value: number;
    color: string;
}

export function DonutChart({ data }: { data: Segment[] }) {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let accumulatedAngle = 0;

    if (total === 0) {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-full h-full rounded-full border-4 border-muted/20" />
                <span className="absolute text-xs text-muted-foreground">No Data</span>
            </div>
        );
    }

    const segments = data.reduce((acc: any[], segment) => {
        const startAngle = acc.length > 0 ? acc[acc.length - 1].endAngle : 0;
        const angle = (segment.value / total) * 360;
        acc.push({
            ...segment,
            angle,
            startAngle,
            endAngle: startAngle + angle
        });
        return acc;
    }, []);

    return (
        <div className="relative w-full h-full">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {segments.map((segment, i) => {
                    const radius = 40;
                    const circumference = 2 * Math.PI * radius;
                    // Use a slightly smaller dash array to create a "gap" if desired, but for now exact match
                    const strokeDasharray = `${(segment.angle / 360) * circumference} ${circumference}`;
                    const strokeDashoffset = -((segment.startAngle / 360) * circumference);

                    return (
                        <circle
                            key={i}
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke={segment.color}
                            strokeWidth="20"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-500 hover:opacity-80"
                        />
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-xl font-bold">{total}</span>
                <span className="text-[10px] text-muted-foreground">Total</span>
            </div>
        </div>
    );
}
