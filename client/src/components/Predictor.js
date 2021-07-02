import React, {Component} from "react";
import Graph from './Graph'
import axios from 'axios'
import '../App.css';

//typing bar that posts to database
//input has dropdown menu to choose date of purchase
//graph
//refresh button
const REST_API_URL = "http://localhost:8080//api/v1/forecast/"

class Predictor extends Component {
    
    render() {
        return (
            <div>
                <form method="post">
                    <input type="date" id="purchaseDate" name="purchaseDate"></input>
                    <input type="number" min="1" step="any" />
                    <button type="submit">Enter</button>
                </form>
                let forecast = getForecast(this.props.user.data)
                <Graph data={forecast}/>   
            </div>
        );
    }

    getForecast(data) {
        var req = JSON.stringify(data)
        console.log(req)
        const request = JSON.parse(req)
        return axios.get(REST_API_URL, {
            params: {
              input: data
            }
        })
    }
    

}

export default Predictor;