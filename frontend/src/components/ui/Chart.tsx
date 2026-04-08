import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Card from "./Card";

ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler
);

interface ChartProps {
  title: string;
  labels: string[];
  values: number[];
}

export default function Chart({ title, labels, values }: ChartProps) {
    const getGradient = (ctx: any, chartArea: any) => {
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, "rgba(166, 124, 82, 0.8)");
        gradient.addColorStop(1, "rgba(212, 175, 55, 0)");
        return gradient;
    };

    const data = {
        labels,
        datasets: [
        {
            data: values,
            borderColor: "#c2864a",
            backgroundColor: (context: any) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return;
            return getGradient(ctx, chartArea);
            },
            fill: true,
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: "#c2864a",
        },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
        mode: "index",
        intersect: false,
        },
        plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: "#ffffff",
            titleColor: "#c2864a",
            bodyColor: "#c2864a",
            borderColor: "#c2864a",
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
            label: (context: any) => `Value: ${context.raw}`,
            },
        },
        },
        scales: {
        x: {
            ticks: { color: "#c2864a", maxRotation: 0, minRotation: 0 },
            grid: { display: false },
        },
        y: {
            ticks: {
            color: "#c2864a",
            callback: (value: any) => (window.innerWidth < 768 ? "" : value),
            },
            grid: { color: "rgba(0,0,0,0.08)" },
        },
        },
    };

    return (
        <Card className="w-full h-[280px] md:h-[500px] p-2 md:p-5">
            <h2 className="text-gold text-sm sm:text-base md:text-lg font-bold mb-4 sm:mb-8">
                {title}
            </h2>

            <div className="h-[85%] w-full">
                <Line data={data} options={options} />
            </div>
        </Card>
    );
}

export const ChartSkeleton = () => (
    <Card className="flex flex-col gap-5 w-full h-[300px] md:h-[500px] animate-pulse">
        <div className="w-[60%] md:w-[40%] h-10 bg-gray-400 rounded-md"></div>
        <div className="w-full flex-1 bg-gray-400 rounded-md"></div>
    </Card>
);