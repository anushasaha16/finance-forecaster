import React, {Component} from "react";
import Graph from './Graph'
import '../App.css';

class Predictor extends Component {
    render() {
        return (
            <div>
                <form action="http://localhost:4000/submit" method="POST">
                    <input type="date" id="purchaseDate" name="purchaseDate"></input>
                    <input type="number" min="1" step="any" name="amount"/>
                    <button type="submit">Enter</button>
                </form>             
                <Graph data={this.props.user.data}/>   
            </div>
        );
    }
}

export default Predictor;