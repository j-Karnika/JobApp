import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    console.log(history)
    console.log('System logged out')
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <ul className="navbar">
      <li>
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="header-logo"
          />
        </Link>
      </li>
      <li className="link-items">
        <Link className="list-item" to="/">
          Home
        </Link>
        <Link className="list-item" to="/jobs">
          Jobs
        </Link>
      </li>
      <li>
        <button type="button" className="header-btn" onClick={onLogout}>
          Logout
        </button>
      </li>
    </ul>
  )
}

export default withRouter(Header)
