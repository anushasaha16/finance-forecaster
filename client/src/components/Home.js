import React, {Component} from 'react';
import Header from './Header';
import Predictor from './Predictor'
import '../App.css';
import PropTypes from 'prop-types';

class Home extends Component {
    static propTypes = {
        user: PropTypes.shape({
            
        })
    }
    
    state = {
        user: {},
        error: null,
        authenticated: false
    };

    componentDidMount() {
        fetch('http://localhost:4000/auth/login/success', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        })
        .then(response => {
            if (response.status === 200)
                return response.json();
            throw new Error('failed to authenticate user')
        })
        .then(responseJson => {
            this.setState({
                authenticated: true,
                user: responseJson.user
            })
        })
        .catch(error => {
            this.setState({
                authenticated: false,
                error: "Failed to authenticate user"
            })
        })
    }

    render() {
        const {authenticated} = this.state;
        return (
            <div className='App'>
                <Header
                    authenticated={authenticated}
                    handleNotAuthenticated={this._handleNotAuthenticated}
                />   
                <div>
                    {!authenticated ? (
                        <div className='App-home'>
                            <h1>Finance Forecaster</h1> 
                            <h4>
                                Make budget planning a more efficient process by tracking your finances and getting
                                predictions for future spending habits!
                            </h4>
                            <img 
                                className="App-logo"
                                src='logo.png'>
                            </img>
                        </div>    
                    ) : (
                        <div className='App-predictor'>
                            <h2>Welcome!</h2>
                            <h4>
                                Enter a past expense, the spending category for that expense, and the purchase data below
                                for a forecast of future expenses!
                            </h4>
                            <Predictor user={this.state.user}/>
                        </div>    
                    )}
                </div>
            </div>
        )
    }
    
    _handleNotAuthenticated = () => {
        this.setState({ authenticated: false });
    };
}

export default Home;