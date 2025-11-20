"use client";
import { useDashboardStore } from "../store/dashboard.store";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { useMemo } from "react";

const COLORS = ["#22c55e", "#e11d48", "#facc15", "#38bdf8", "#a78bfa"];

export function ChartsSection() {
    const { charts } = useDashboardStore();

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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Income vs Expense */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 pb-12">
                <h2 className="text-lg font-semibold mb-8 text-neutral-100">
                    Monthly Overview
                </h2>
                <ResponsiveContainer width="100%" height="95%">
                    <BarChart data={byMonth}>
                        <XAxis
                            dataKey="month"
                            stroke="#888"
                            style={{ fontSize: "0.85rem" }}
                        />
                        <YAxis
                            stroke="#888"
                            tickFormatter={(value) =>
                                `$${value.toLocaleString()}`
                            }
                            style={{
                                fontSize: "0.85rem",
                            }}
                        />
                        <Bar
                            dataKey="income"
                            fill="#22c55e"
                            radius={[4, 4, 0, 0]}
                            name="Income"
                        />
                        <Bar
                            dataKey="expense"
                            fill="#e11d48"
                            radius={[4, 4, 0, 0]}
                            name="Expense"
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            wrapperStyle={{
                                color: "#d4d4d8",
                                fontSize: "0.85rem",
                                bottom: 0,
                            }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Category-wise Distribution */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-8 text-neutral-100">
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
                    >
                        {byCategory.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                        ))}
                    </Pie>

                    {/* Legend only (no labels/pointers) */}
                    <Legend
                        verticalAlign="bottom"
                        height={60}
                        wrapperStyle={{
                            color: "#d4d4d8",
                            fontSize: "0.85rem",
                            bottom: -20,
                        }}
                    />
                </PieChart>
            </div>
        </div>
    );
}
