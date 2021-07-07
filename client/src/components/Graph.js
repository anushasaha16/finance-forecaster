import React, {Component} from "react";
import {CanvasJSChart} from 'canvasjs-react-charts'

class Graph extends Component {
	render() {
		const data = this.props.data
		
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title:{
				text: "Personal Spending"
			},
			axisY: {
				title: "Value ($)",
				suffix: "",
				valueFormatString: "##,###.##",
			},
			axisX: {
				title: "Month",
				prefix: "",
                interval: 1,
				valueFormatString: "####",
			},
			data: [{
				type: "line",
				toolTipContent: "{x}: ${y}",
				dataPoints: [
					{ x: "01/21", y: data[0] },
					{ x: "02/21", y: data[1] },
					{ x: "03/21", y: data[2] },
					{ x: "04/21", y: data[3] },
					{ x: "05/21", y: data[4] },
					{ x: "06/21", y: data[5] },
					{ x: "07/21", y: data[6] },
					{ x: "08/21", y: data[7] },
					{ x: "09/21", y: data[8] },
				]
			}]
		}
		return (
		<div>
			<CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}
export default Graph;  