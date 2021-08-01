import {Link} from 'react-router-dom';
import PropTypes from "prop-types"
import React, {Component} from 'react';
import '../App.css';

class Header extends Component {
    static propTypes = {
        authenticated: PropTypes.bool.isRequired
    }

    render() {
        const { authenticated } = this.props;
        return (
          <div className='App-header'>
            <Link to="/">Home</Link>
            {authenticated ? (
              <a href="http://localhost:4000/auth/logout">Logout</a>
            ) : (
              <a href="http://localhost:4000/auth/google/">Login</a>
            )}
          </div>
        );
    }

    _signIn = () => {
        window.open("http://localhost:4000/auth/google/", "_self");        
    }

    _logout = () => {
        window.open("http://localhost:4000/auth/logout", "_self");
        this.props.handleNotAuthenticated();
    }
}

export default Header;