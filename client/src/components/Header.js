import {Link} from 'react-router-dom';
import PropTypes from "prop-types"
import React, {Component} from 'react';

class Header extends Component {
    static propTypes = {
        authenticated: PropTypes.bool.isRequired
    }

    render() {
        const { authenticated } = this.props;
        return (
          <ul className="menu">
            <li>
              <Link to="/">Home</Link>
            </li>
            {authenticated ? (
              <li onClick={this._logout}>Logout</li>
            ) : (
              <li onClick={this._signIn}>Login</li>
            )}
          </ul>
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