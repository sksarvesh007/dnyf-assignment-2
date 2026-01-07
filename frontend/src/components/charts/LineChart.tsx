"use client";

interface DataPoint {
    label: string;
    value: number;
}

export function LineChart({ data, color = "currentColor" }: { data: DataPoint[], color?: string }) {
    if (!data.length) return <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">No data</div>;

    const values = data.map(d => d.value);
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0); // Assuming 0 based or min value

    // Normalize points
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d.value - min) / (max - min)) * 100;
        return `${x},${y}`;
    }).join(" ");

    return (
        <div className="w-full h-full flex flex-col justify-end">
            <div className="relative h-full w-full overflow-visible">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                    <line x1="0" y1="100" x2="100" y2="100" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />

                    {/* Chart Line */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Area below line (optional, for gradient effect) */}
                    <polygon
                        points={`0,100 ${points} 100,100`}
                        fill={color}
                        fillOpacity="0.1"
                    />
                </svg>

                {/* X-Axis Labels */}
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground px-1">
                    <span>{data[0]?.label}</span>
                    <span>{data[data.length - 1]?.label}</span>
                </div>
            </div>
        </div>
    );
}
