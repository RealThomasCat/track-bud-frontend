"use client";
import { useDashboardStore } from "../store/dashboard.store";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/formatters";
import { useAuthStore } from "@/modules/auth/store/auth.store";

const COLORS = ["#22c55e", "#e11d48", "#facc15", "#38bdf8", "#a78bfa"];

type LegendItem = {
    label: string;
    color: string;
};

type TooltipPayload = {
    name?: string;
    value?: number | string;
    color?: string;
    payload?: {
        name?: string;
        value?: number | string;
    };
};

type ChartTooltipProps = {
    active?: boolean;
    label?: string | number;
    payload?: TooltipPayload[];
    currency?: string;
    type: "bar" | "pie";
};

function formatMonthLabel(value?: string | number) {
    if (!value) return "";

    const [year, month] = String(value).split("-");
    const monthIndex = Number(month) - 1;

    if (!year || !Number.isInteger(monthIndex)) return value;

    const date = new Date(Number(year), monthIndex, 1);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        year: "2-digit",
    }).format(date);
}

function ChartTooltip({
    active,
    label,
    payload,
    currency,
    type,
}: ChartTooltipProps) {
    if (!active || !payload?.length) return null;

    if (type === "pie") {
        const item = payload[0];
        const name = item.payload?.name ?? item.name;
        const value = item.payload?.value ?? item.value;

        return (
            <div className="rounded-md border border-neutral-700 bg-neutral-950/95 px-3 py-2 text-xs text-neutral-100 shadow-lg shadow-black/30">
                <span className="text-neutral-300">{name}</span>{" "}
                <span className="font-medium">
                    {formatCurrency(value, currency)}
                </span>
            </div>
        );
    }

    return (
        <div className="rounded-md border border-neutral-700 bg-neutral-950/95 px-3 py-2 text-xs shadow-lg shadow-black/30">
            <p className="mb-1 font-medium text-neutral-100">
                {formatMonthLabel(label)}
            </p>
            <div className="space-y-1">
                {payload.map((item) => (
                    <div
                        key={item.name}
                        className="flex min-w-28 items-center justify-between gap-4"
                    >
                        <span
                            className="capitalize"
                            style={{ color: item.color }}
                        >
                            {item.name}
                        </span>
                        <span className="font-medium text-neutral-100">
                            {formatCurrency(item.value, currency)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Custom legend component
export const CustomLegend = ({ items }: { items: LegendItem[] }) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-neutral-300 text-sm px-2">
            {items.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                    <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                    />
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export function ChartsSection() {
    const { charts } = useDashboardStore();
    const currency = useAuthStore((state) => state.user?.defaultCurrency);

    const { byCategory, byMonth } = useMemo(() => {
        if (!charts) return { byCategory: [], byMonth: [] };

        // --- Transform category data ---
        // Sort categories descending by value, take top 4, sum the rest as "Other"
        const sorted = [...charts.byCategory].sort(
            (a, b) => Number(b.total) - Number(a.total)
        );
        const topFour = sorted.slice(0, 4);
        const others = sorted.slice(4);

        const otherTotal = others.reduce(
            (sum, c) => sum + Number(c.total || 0),
            0
        );

        const mergedData =
            others.length > 0
                ? [...topFour, { category: "Others", total: otherTotal }]
                : topFour;

        const byCategory = mergedData.map((c, i) => ({
            name: c.category,
            value: Number(c.total),
            color: COLORS[i % COLORS.length],
        }));

        // --- Transform month data ---
        const byMonth = charts.byMonth.map((m) => ({
            month: m.month,
            income: Number(m.income),
            expense: Number(m.expense),
        }));

        return { byCategory, byMonth };
    }, [charts]);

    if (!charts) return null;

    return (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Income vs Expense */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 min-h-100 md:min-h-128">
                <h2 className="text-lg font-semibold mb-6 text-neutral-100 w-full text-center">
                    Monthly Overview
                </h2>
                <div className="flex flex-col items-center">
                    <div
                        style={{
                            width: "100%",
                        }}
                    >
                        <ResponsiveContainer
                            width="100%"
                            className="h-70! md:h-100!"
                        >
                            <BarChart data={byMonth}>
                                <XAxis
                                    dataKey="month"
                                    stroke="#888"
                                    style={{ fontSize: "0.85rem" }}
                                />
                                <YAxis
                                    stroke="#888"
                                    tickFormatter={(value) =>
                                        formatCurrency(value, currency, {
                                            notation: "compact",
                                        })
                                    }
                                    style={{ fontSize: "0.85rem" }}
                                />
                                <Tooltip
                                    cursor={{
                                        fill: "rgba(255,255,255,0.04)",
                                    }}
                                    content={(props) =>
                                        (
                                            <ChartTooltip
                                                {...props}
                                                currency={currency}
                                                type="bar"
                                            />
                                        )
                                    }
                                />
                                <Bar
                                    dataKey="income"
                                    fill="#22c55e"
                                    radius={[4, 4, 0, 0]}
                                    name="Income"
                                    activeBar={false}
                                />
                                <Bar
                                    dataKey="expense"
                                    fill="#e11d48"
                                    radius={[4, 4, 0, 0]}
                                    name="Expense"
                                    activeBar={false}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <CustomLegend
                        items={[
                            { label: "Income", color: "#22c55e" },
                            { label: "Expense", color: "#e11d48" },
                        ]}
                    />
                </div>
            </div>

            {/* Category-wise Distribution */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col items-center min-h-100 md:min-h-128">
                <h2 className="text-lg font-semibold mb-6 text-neutral-100 w-full text-center">
                    By Category
                </h2>

                <PieChart
                    style={{
                        width: "100%",
                        maxWidth: "400px",
                        maxHeight: "80vh",
                        aspectRatio: 1,
                    }}
                >
                    <Pie
                        data={byCategory}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="60%"
                        outerRadius="100%"
                        isAnimationActive
                        activeShape={false}
                        stroke="none"
                        strokeWidth={0}
                    >
                        {byCategory.map((entry) => (
                            <Cell
                                key={entry.name}
                                fill={entry.color}
                                stroke="none"
                                strokeWidth={0}
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        cursor={false}
                        content={(props) =>
                            (
                                <ChartTooltip
                                    {...props}
                                    currency={currency}
                                    type="pie"
                                />
                            )
                        }
                    />

                    {/* Legend only (no labels/pointers) */}
                    {/* <Legend content={<WrappedLegend />} /> */}
                </PieChart>
                <CustomLegend
                    items={byCategory.map((c) => ({
                        label: c.name,
                        color: c.color,
                    }))}
                />
            </div>
        </div>
    );
}
