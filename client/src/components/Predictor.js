import React, {Component} from "react";
import Graph from './Graph'
import '../App.css';

class Predictor extends Component {
    render() {
        return (
            <div>
                <form class="form-inline" action="http://localhost:4000/submit" method="POST">
                    <div class="row">
                        <div class="col">
                            <input class="form-control" type="date" name="purchaseDate"></input>
                        </div>
                        <div class="col">
                            <select class="form-control" name="categories">
                                <option value="housing">Housing</option>
                                <option value="transportation">Transportation</option>
                                <option value="food">Food</option>
                                <option value="utilities">Utilities</option>
                                <option value="personalSpending" selected="selected">Personal Spending</option>
                                <option value="recreation">Recreation and Entertainment</option>
                            </select>
                        </div>
                        <div class="col">
                            <input class="form-control" type="number" min="1" step="any" name="amount" placeholder="Amount"/>
                        </div>
                    </div>
                    <button class="btn btn-primary" type="submit">Enter</button>
                    </form>
                    <div className='graph'>           
                        <Graph data={this.props.user.data}/>
                    </div>  
            </div>
        );
    }
}

export default Predictor;