import React from "react";
import ReactHighcharts from "react-highcharts";
import chart from "../../assets/images/chart-2.png";
import "./ProspectChart.style.scss";

require('highcharts-more')(ReactHighcharts.Highcharts);

const DEFAULT_CLASSNAME = "prospect-chart";

const ProspectChart = (props) => {
	const { data } = props;

	const config = {
		chart: {
			type: "bubble",
      zoomType: "xy",
      height: 200,
    },

    colors: ['rgb(255 129 181)'],
    
    title: { text: undefined },

		legend: { enabled: false, },
		

		xAxis: {
      gridLineWidth: 0,
      startOnTick: true,
      tickInterval: 1,
      tickLength: -5,
      minorTickLength: -10,
      labels: { enabled: false, }

		},

		yAxis: {
      startOnTick: true,
      gridLineWidth: 0,
      tickInterval: 1,
			endOnTick: false,
			labels: { enabled: false, },
      title: { text: undefined },
			maxPadding: 0.2,
		},

		tooltip: {
      enabled: false,
			useHTML: true,
			headerFormat: "<table>",
			footerFormat: "</table>",
			followPointer: true,
		},

		plotOptions: {
			series: {
				dataLabels: {
					enabled: false,
					format: "{point.name}",
				},
			},
		},

		series: [
			{
				data: [
					{ x: 7 * 1, y: 20, z: 33.8 },
					{ x: 7 * 2, y: 20, z: 24.7 },
					{ x: 7 * 3, y: 20, z: 15.8 },
					{ x: 7 * 4, y: 20, z: 22 },
					{ x: 7 * 5, y: 20, z: 11.8 },
					{ x: 7 * 6, y: 20, z: 46.6 },
					{ x: 7 * 7, y: 20, z: 34.5 },
					{ x: 7 * 8, y: 20, z: 20 },
					{ x: 7 * 9, y: 20, z: 24.7 },
					{ x: 7 * 10, y: 20, z: 10.4 },
					{ x: 7 * 11, y: 20, z: 16 },
					{ x: 7 * 12, y: 20, z: 35.3 },
					{ x: 7 * 13, y: 20, z: 28.5 },
					{ x: 7 * 14, y: 20, z: 15.4 },
					{ x: 7 * 15, y: 20, z: 31.3 },
				],
			},
		],
	};

	return (
		<div className={`${DEFAULT_CLASSNAME}`}>

      {/* <ReactHighcharts config={config}></ReactHighcharts> */}
			<img src={chart} />
		</div>
	);
};

export default ProspectChart;
