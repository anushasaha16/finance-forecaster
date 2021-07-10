import React, {Component} from "react";
import {CanvasJSChart} from 'canvasjs-react-charts'
import axios from 'axios'
const REST_API_URL = "http://127.0.0.1:5000/api/v1/forecast/"

class Graph extends Component {
	state = {
		input: [],
		predictions: []
	}
	componentDidMount() {
		const data = this.props.data;
		let userInput = [];
        let d = new Date();
        for (let i = 6; i > 0; i--) {
            let d = new Date();
            d.setMonth(d.getMonth() + 1 - i);
            let month = d.getMonth();
            let year = d.getFullYear();
			if (month == 0) {
				month = 12;
				year--;
			}
            let dateString = month + "/" + year;
            console.log(dateString)
            if (dateString in data) {
                userInput.push(parseFloat(data[dateString]))
            } else {
                userInput.push(0);
            }
        }
		this.setState({
			input: userInput
		})
		axios.get(REST_API_URL, {
            params: {
              input1: userInput[0],
              input2: userInput[1],
              input3: userInput[2],
              input4: userInput[3],
              input5: userInput[4],
              input6: userInput[5],
            }
        }).then((response) => {
		  this.setState({
			...this.state,
			predictions: response.data
		  })      
		})
	}

	render() {
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
					{ x: 1, y: this.state.input[0] },
					{ x: 2, y: this.state.input[1] },
					{ x: 3, y: this.state.input[2] },
					{ x: 4, y: this.state.input[3] },
					{ x: 5, y: this.state.input[4] },
					{ x: 6, y: this.state.input[5] },
					{ x: 7, y: this.state.predictions[0] },
					{ x: 8, y: this.state.predictions[1] },
					{ x: 9, y: this.state.predictions[2] },
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