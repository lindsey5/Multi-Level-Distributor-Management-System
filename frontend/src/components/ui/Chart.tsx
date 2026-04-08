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

    const data = {
        labels,
        datasets: [
        {
            data: values,
            borderColor: "black",
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
            ticks: { maxRotation: 0, minRotation: 0 },
            grid: { display: false },
        },
        y: {
            ticks: {
            callback: (value: any) => (window.innerWidth < 768 ? "" : value),
            },
            grid: { color: "rgba(0,0,0,0.08)" },
        },
        },
    };

    return (
        <Card className="w-full h-[300px] md:h-[500px] p-3 md:p-5">
            <h2 className="text-sm sm:text-base md:text-lg font-bold mb-4 sm:mb-8">
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