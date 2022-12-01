import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

let width, height, gradient;
function getGradient(ctx, chartArea, r, g, b) {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (r == null) { r = 255 }
  if (g == null) { g = 237 }
  if (b == null) { b = 71 }
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.1)`);
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
                data={{
                    datasets: [
                        this.props.data.map((item, _) => {
                            return {
                                label: item.label,
                                tension: .25,
                                data: item.data,
                                fill: true,
                                backgroundColor: function(context) {
                                    const chart = context.chart;
                                    const {ctx, chartArea} = chart;
                            
                                    if (!chartArea) {
                                        // This case happens on initial chart load
                                        return;
                                    }
                                    return getGradient(ctx, chartArea, item.r, item.g, item.b);
                                },
                                borderColor: "transparent",
                            }
                        })
                    ]
                }}
                {...this.props}
            />
        )
    }
}