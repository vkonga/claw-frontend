import { Component } from 'react';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router-dom';
import './index.css'

class SignIn extends Component {
  state = { username: "", password: "",errorMsg:"" };

  onChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  onSubmitSuccess = (jwtToken) => {
    const { history } = this.props;
    Cookies.set('jwt_token', jwtToken, { expires: 30 });
    history.replace('/');
  };

  onSubmitForm = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    
    const userDetails = { username, password };
    const url = "https://claw-backend-a336.onrender.com/login";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log('Response data:', data);
  
      if (response.ok) {
        this.onSubmitSuccess(data.token);
      } else {
        // Handle login failure
        this.setState({ errorMsg: "Invalid Username or Password" });
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      this.setState({ errorMsg: "Invalid Details. Please try again." })
    }
  };

  render() {
    const { username, password, errorMsg } = this.state;
    return (
      <div className='sign-container'>
        <form className='form-container' onSubmit={this.onSubmitForm}>
          <h1 className='sign-heading'>SIGN IN</h1>
          <div className='container'>
            <label className='label' htmlFor="username">USERNAME</label>
            <input
              className='input'
              value={username}
              id="username"
              onChange={this.onChangeUsername}
              type="text"
              placeholder="Enter Username"
            />
          </div>
          <div className='container'>
            <label className='label' htmlFor="password">PASSWORD</label>
            <input
              className='input'
              value={password}
              id="password"
              onChange={this.onChangePassword}
              type="password"
              placeholder="Enter Password"
            />
          </div>
          <button className='sign-button' type="submit">Sign In</button>
          {errorMsg  && <p style={{color:"white"}} className='error-message'>{errorMsg}</p>}
        </form>
        <p>New user? Please <a href='/signup'>Sign Up here</a></p>
      </div>
    );
  }
}

export default withRouter(SignIn);
