import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

let width, height, gradient;
function getGradient(ctx, chartArea, r, g, b) {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  console.log(r)
  if (r == undefined) { r = 255 }
  if (g == undefined) { g = 237 }
  if (b == undefined) { b = 71 }
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  }

  return gradient;
}

export class LineChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Line
                width={this.props.width}
                height={this.props.height}
                className="data-chart"
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            display: false
                        },
                        x: {
                            display: false
                        }
                    }                
                }}
                data={{
                    labels: this.props.labels,
                    datasets: this.props.data.map((item, _) => {
                        if (item.r == undefined) { item.r = 255; }
                        if (item.g == undefined) { item.g = 237; }
                        if (item.b == undefined) { item.b = 71; }
                        return {
                            label: item.label,
                            tension: .5,
                            data: item.data,
                            fill: true,
                            parsing: {
                                yAxisKey: 'y',
                                xAxisKey: 'x'
                            },
                            pointRadius: 2,
                            pointBackgroundColor: "transparent",
                            backgroundColor: `rgba(${item.r}, ${item.g}, ${item.b}, 0.5)`,
                            borderColor: `rgba(${item.r}, ${item.g}, ${item.b}, 1)`,
                            borderWidth: 2,
                        }
                    })
                }}
            />
        )
    }
}