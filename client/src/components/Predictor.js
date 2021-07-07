import React, {Component} from "react";
import Graph from './Graph'
import axios from 'axios'
import '../App.css';

//typing bar that posts to database
//input has dropdown menu to choose date of purchase
//graph
//refresh button
const REST_API_URL = "http://127.0.0.1:5000/api/v1/forecast/"

class Predictor extends Component {
    
    render() {
        return (
            <div>
                <form action="/submit" method="POST">
                    <input type="date" id="purchaseDate" name="purchaseDate"></input>
                    <input type="number" min="1" step="any" name="amount"/>
                    <button type="submit">Enter</button>
                </form>
                let forecast = getForecast(this.props.user.data)
                <Graph data={forecast}/>   
            </div>
        );
    }

    getForecast(data) {
        let userInput = [];
        let d = new Date();
        for (let i = 6; i > 0; i--) {
            d.setMonth(d.getMonth() - i);
            let month = d.getMonth();
            let year = d.getFullYear();
            let dateString = month + "/" + year;
            if (dateString in data) {
                userInput.push(data[dateString])
            } else {
                userInput.push(0);
            }
        }
        var req = JSON.stringify(userInput)
        console.log(req)
        const request = JSON.parse(req)
        return axios.get(REST_API_URL, {
            params: {
              input: userInput
            }
        })
    }
    

}

export default Predictor;