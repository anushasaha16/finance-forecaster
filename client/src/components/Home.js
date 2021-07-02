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
            <div>
                <Header
                    authenticated={authenticated}
                    handleNotAuthenticated={this._handleNotAuthenticated}
                />   
                <div>
                    {!authenticated ? (
                        <div>
                            <h1>Finance Forecaster</h1> 
                            <img 
                                className="App-logo"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK5SKtd68HG1K0K3SNNIkZo_bZLbynvMEamg&usqp=CAU">
                            </img>
                        </div>    
                    ) : (
                        <div>
                            <h2>Welcome!</h2>
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