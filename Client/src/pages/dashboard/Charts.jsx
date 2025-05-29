'use client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart,
    PieChart,
    Radar,
    ChartBar,
    ChartScatter,
    ChartColumn,
    Torus,
    ChartNoAxesCombined,
    ChartArea
} from 'lucide-react';

const iconMap = {
    hbar: ChartBar,
    vbar: ChartColumn,
    bubble: ChartScatter,
    doughnut: Torus,
    line: LineChart,
    mixed: ChartNoAxesCombined,
    pie: PieChart,
    polar: Radar,
    radar: Radar,
    area: ChartArea,
};

const charts = {
    '2D Charts': [
        { name: 'Horizontal Bar Chart', path: 'barchart', icon: 'hbar' },
        { name: 'Vertical Bar Chart', path: 'Charts/2dCharts/VerticalBarChart', icon: 'vbar' },
        { name: 'Bubble Chart', path: 'Charts/2dCharts/BubbleChart', icon: 'bubble' },
        { name: 'Doughnut Chart', path: 'Charts/2dCharts/DoughnutChart', icon: 'doughnut' },
        { name: 'Line Chart', path: 'Charts/2dCharts/LineChart', icon: 'line' },
        { name: 'Mixed Bar Line', path: 'Charts/2dCharts/MixedBarLineChart', icon: 'mixed' },
        { name: 'Pie Chart', path: 'Charts/2dCharts/PieChart', icon: 'pie' },
        { name: 'Polar Area Chart', path: 'Charts/2dCharts/PolarAreaChart', icon: 'polar' },
        { name: 'Radar Chart', path: 'Charts/2dCharts/RadarChart', icon: 'radar' },
    ],
    '3D Charts': [
        { name: 'Vertical Bar Chart', path: 'Charts/3dCharts/VerticalBarChart', icon: 'vbar' },
        { name: 'Horizontal Bar Chart', path: 'Charts/3dCharts/HorizontalBarChart', icon: 'hbar' },
        { name: 'Area Chart', path: 'Charts/3dCharts/AreaChart', icon: 'area' },
        { name: 'Bubble Chart', path: 'Charts/3dCharts/BubbleChart', icon: 'bubble' },
        { name: 'Doughnut Chart', path: 'Charts/3dCharts/DoughnutChart', icon: 'doughnut' },
        { name: 'Line Chart', path: 'Charts/3dCharts/LineChart', icon: 'line' },
        { name: 'Mixed Bar Line', path: 'Charts/3dCharts/MixedBarLineChart', icon: 'mixed' },
        { name: 'Pie Chart', path: 'Charts/3dCharts/PieChart', icon: 'pie' },
        { name: 'Polar Area Chart', path: 'Charts/3dCharts/PolarAreaChart', icon: 'polar' },
    ]
};

export default function ChartsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [loaderMessage, setLoaderMessage] = useState('');
    const navigate = useNavigate()


    const handleNavigation = (path,keyword) => {
        navigate(path)
        // setLoaderMessage(`Loading ${keyword} ...`);
        // setIsLoading(true);
        // setTimeout(() => router.push(path), 100); // Short delay
    };

    return (
        <div className="min-h-screen bg-gradient-to-br p-6 md:p-8 relative">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md bg-opacity-50 ">
                    <div className="text-center flex flex-col justify-center items-center">
                        <img className='w-[70px] h-[70px]' src="/evolution.gif" alt="" />
                        <p id='loader' className="mt-4 text-black text-lg font-medium">{loaderMessage}</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Chart Gallery</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our collection of beautiful 2D and 3D charts for your data visualization needs.
                    </p>
                </header>

                {Object.entries(charts).map(([section, items]) => (
                    <div key={section} className="mb-12">
                        <div className="flex items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">{section}</h2>
                            <span className="ml-3 px-3 py-1 text-xs font-semibold bg-[#e6f0ed] text-[#0f4736] rounded-full">
                                {items.length} charts
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {items.map(({ name, path, icon }) => {
                                const Icon = iconMap[icon];
                                return (
                                    <button
                                        key={name}
                                        onClick={() => navigate("barchart")}
                                        className="group cursor-pointer relative flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden hover:-translate-y-1"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative z-10 w-full flex flex-col items-center">
                                            <div className="mb-4 p-3 bg-[#e6f0ed] rounded-md transition-colors duration-300">
                                                <Icon className="w-8 h-8 text-[#0f4736] transition-colors duration-300" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
                                            <p className="text-sm text-gray-500">View chart</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <footer className="mt-16 text-center text-gray-500 text-sm">
                    <p>Select a chart to explore its features and customization options</p>
                </footer>
            </div>
        </div>
    );
}
