import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import './index.css'

class SignUp extends Component {

    state = {username:"", password:"",role:"",errorMsg:""}

    onChangeUsername = event => {
        this.setState({username:event.target.value})
    }

    onChangePassword = event => {
        this.setState({password:event.target.value})
    }

    onChangeRole = event => {
        this.setState({role:event.target.value})
    }

    onSubmitForm = async (event) => {
        event.preventDefault()
        const id = uuidv4()
        const {username,password,role} = this.state
        if (username === "" || password === "" || role === "") {
            this.setState({ errorMsg: "Username and Password and role cannot be empty" });
            return;
          }
        const {history} = this.props
        const userDetails = {id,username,password,role}
        const url ="https://claw-backend-a336.onrender.com/register"
        const options = {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(userDetails)
        }
        const response = await fetch(url,options)
        if (response.ok === true){
            history.replace("/signin")
        }else {
            this.setState({errorMsg:"Username and Password and role cannot be empty"})
        }
        
    }

    render() {
        const {username,password,role,errorMsg} = this.state
        return (
            <div className='sign-container' >
                <form className='form-container' onSubmit={this.onSubmitForm} >
                    <h1 className='sign-heading' >SIGN UP</h1>
                    <div className='container' >
                        <label className='label' htmlFor='username' >USERNAME</label>
                        <input className='input' value={username} id="username" onChange={this.onChangeUsername} type="text" placeholder='Enter Username' />
                    </div>
                    <div className='container'>
                        <label className='label' htmlFor='password' >PASSWORD</label>
                        <input className='input' value={password} id="password" onChange={this.onChangePassword} type="password" placeholder='Enter Password' />
                    </div>
                    <div className='container'>
                        <label className='label' htmlFor='role' >ROLE NAME</label>
                        <input className='input' value={role} id="role" onChange={this.onChangeRole} type="text" placeholder='Enter Role' />
                    </div>
                    <button className='sign-button' type="submit" >SignUp</button>
                    {errorMsg  && <p style={{color:"white"}} className='error-message'>{errorMsg}</p>}
                </form>
                <p>already exist user.plese <a href='/signin' className='signin-here' >SignIn here</a></p>
            </div>
        )
    }
}

export default SignUp