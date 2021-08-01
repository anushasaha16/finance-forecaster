import React, {Component} from "react";
import {CanvasJSChart} from 'canvasjs-react-charts'
import axios from 'axios'
const REST_API_URL = "http://127.0.0.1:5000/api/v1/forecast/"

class Graph extends Component {
	state = {
		category: "personalSpending",
		input: [],
		predictions: [],
	}
	categoryDict = {
		'housing': 'Housing',
		'transportation': 'Transportation',
		'food': 'Food',
		'utilities': 'Utilities',
		'personalSpending': 'Personal Spending',
		'recreation': 'Recreation and Entertainment'
	}

	getDate(num) {
		let date = new Date();
        date.setMonth(date.getMonth() - num);
		return date;
	}
	
	componentDidMount() {
		const data = this.props.data[this.state.category];
		let userInput = [];
        for (let i = 5; i >= 0; i--) {
            let d = this.getDate(i)
			console.log(d)
            let month = d.getMonth() + 1;
            let year = d.getFullYear();
			if (month == 0) {
				month = 12;
				year--;
			}
            let dateString = month + "/" + year;
            if (dateString in data) {
                userInput.push(parseFloat(data[dateString]))
            } else {
                userInput.push(0);
            }
        }
		this.setState({
			...this.state,
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
	
	handleChange(event) {
		console.log(event.target.value)
		let chosenCategory = event.target.value;
		const data = this.props.data[chosenCategory];
		let userInput = [];
        for (let i = 5; i >= 0; i--) {
            let d = this.getDate(i)
			console.log(d)
            let month = d.getMonth() + 1;
            let year = d.getFullYear();
			if (month == 0) {
				month = 12;
				year--;
			}
            let dateString = month + "/" + year;
            if (dateString in data) {
                userInput.push(parseFloat(data[dateString]))
            } else {
                userInput.push(0);
            }
        }
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
			category: chosenCategory,
			input: userInput,
			predictions: response.data
		  })      
		})
	} 
	render() {
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "dark2", // "light1", "dark1", "dark2"
			backgroundColor: "#1e90ff",
			title:{
				text: this.categoryDict[this.state.category]
			},
			axisY: {
				title: "Expense ($)",
				suffix: "",
				valueFormatString: "##,###.##",
			},
			axisX: {
				title: "Month",
				prefix: "",
                interval: 1,
        		intervalType: "month"
			},
			data: [{
				type: "line",
				lineColor:"black",
				toolTipContent: "${y}",
				dataPoints: [
					{ x: this.getDate(5), y: this.state.input[0], color: "black"},
					{ x: this.getDate(4), y: this.state.input[1], color: "black"},
					{ x: this.getDate(3), y: this.state.input[2], color: "black"},
					{ x: this.getDate(2), y: this.state.input[3], color: "black"},
					{ x: this.getDate(1), y: this.state.input[4], color: "black"},
					{ x: this.getDate(0), y: this.state.input[5], color: "black"},
					{ x: this.getDate(-1), y: this.state.predictions[0], color: "grey"},
					{ x: this.getDate(-2), y: this.state.predictions[1], color: "grey"},
					{ x: this.getDate(-3), y: this.state.predictions[2], color: "grey"},
				]
			}]
		}
		return (
		<div>
			<CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>
			Choose which spending category you want to see trajectory for:
			<select class="form-control" name="categories" onChange={this.handleChange.bind(this)}>
                <option value="housing">Housing</option>
                <option value="transportation">Transportation</option>
                <option value="food">Food</option>
                <option value="utilities">Utilities</option>
                <option value="personalSpending" selected="selected">Personal Spending</option>
                <option value="recreation">Recreation and Entertainment</option>
            </select>
		</div>
		);
	}
}
export default Graph;  