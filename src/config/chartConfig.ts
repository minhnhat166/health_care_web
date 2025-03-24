import type { MedicationItem } from '@/utils/hooks/useDashboardData'
import { lightenColor } from '@/utils/colorUtils'
import { ApexOptions } from 'apexcharts'

// Shared color palette
export const PIE_CHART_COLORS = [
    '#1f2937', // Gray 800
    '#3b82f6', // Blue 500
    '#10b981', // Green 500
    '#f59e0b', // Yellow 500
    '#ef4444', // Red 500
    '#8b5cf6', // Purple 500
    '#ec4899', // Pink 500
    '#14b8a6', // Teal 500
    '#f97316', // Orange 500
    '#6366f1', // Indigo 500
    '#06b6d4', // Cyan 500
]

export const getBarChartOptions = (
    medicationData: MedicationItem[],
): ApexOptions => ({
    chart: {
        type: 'bar',
        stacked: false,
        toolbar: {
            show: false,
        },
        fontFamily: 'Inter, sans-serif',
        dropShadow: {
            enabled: true,
            top: 3,
            left: 2,
            blur: 4,
            opacity: 0.1,
        },
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 5,
            dataLabels: {
                position: 'top',
            },
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
    },
    xaxis: {
        categories: medicationData.map((item) => item.name),
        labels: {
            style: {
                colors: '#6c757d',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
            },
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        title: {
            text: 'Count',
            style: {
                color: '#6c757d',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
            },
        },
        labels: {
            style: {
                colors: '#6c757d',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
            },
        },
    },
    fill: {
        opacity: 1,
        type: 'gradient',
        gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.3,
            opacityFrom: 0.9,
            opacityTo: 0.7,
            stops: [0, 100],
        },
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + ' units'
            },
        },
        theme: 'dark',
        style: {
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
        },
    },
    colors: ['#4361ee', '#2ec4b6'],
    grid: {
        borderColor: '#f1f1f1',
        row: {
            colors: ['#f8f9fa', 'transparent'],
            opacity: 0.5,
        },
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        offsetY: -8,
    },
})

export const getPieChartOptions = (
    medicationData: MedicationItem[],
): ApexOptions => ({
    chart: {
        type: 'pie',
        fontFamily: 'Inter, sans-serif',
        dropShadow: {
            enabled: true,
            top: 3,
            left: 2,
            blur: 4,
            opacity: 0.2,
        },
    },
    labels: medicationData.map((item) => item.name),
    responsive: [
        {
            breakpoint: 480,
            options: {
                chart: {
                    width: 200,
                },
                legend: {
                    position: 'bottom',
                },
            },
        },
    ],
    colors: PIE_CHART_COLORS,
    stroke: {
        width: 2,
        colors: ['#fff'],
    },
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            type: 'diagonal1',
            shadeIntensity: 0.9,
            gradientToColors: PIE_CHART_COLORS.map((color) =>
                lightenColor(color, 5),
            ),
            inverseColors: false,
            stops: [0, 90, 100],
        },
    },
    legend: {
        position: 'bottom',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        itemMargin: {
            horizontal: 10,
            vertical: 5,
        },
    },
    tooltip: {
        theme: 'light',
        style: {
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
        },
        fillSeriesColor: false,
        y: {
            formatter: function (val) {
                return val + ' prescriptions'
            },
        },
    },
    dataLabels: {
        enabled: true,
        formatter: (val) => `${Math.round(Number(val))}%`,
        style: {
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold',
            colors: ['#fff'],
        },
        dropShadow: {
            enabled: true,
            blur: 3,
            opacity: 0.7,
        },
    },
    plotOptions: {
        pie: {
            donut: {
                size: '0%',
            },
            customScale: 0.92,
            offsetY: 0,
            expandOnClick: true,
        },
    },
})
