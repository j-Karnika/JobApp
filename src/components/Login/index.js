import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', errorStatus: false}

  showSuccess = jwtToken => {
    const {history} = this.props
    history.replace('/')
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    // console.log(response)
    // console.log(data)
    if (response.ok) {
      this.showSuccess(data.jwt_token)
    } else {
      this.setState({errorMsg: data.error_msg, errorStatus: true})
    }
  }

  onChangeUsername = event => {
    console.log(event.target.value)
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    console.log(event.target.value)
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, errorMsg, errorStatus} = this.state
    const accessToken = Cookies.get('jwt_token')
    console.log(accessToken)
    if (accessToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-container">
        <div className="login-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <label htmlFor="username">USERNAME</label>
            <input
              onChange={this.onChangeUsername}
              type="text"
              id="username"
              placeholder="Username"
              value={username}
            />
            <label htmlFor="password">PASSWORD</label>
            <input
              onChange={this.onChangePassword}
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              className="input-2"
            />
            <button type="submit" className="btn-login">
              Login
            </button>
            {errorStatus && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}
export default Login
