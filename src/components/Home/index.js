import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content-container">
          <h1>Find The Job That Fits Your Life</h1>
          <p>
            Millions of people are searching for jobs,salary information,
            company reviews, find the job that fits your ablities and potiential
          </p>
          <Link to="/jobs">
            <button type="button" className="home-btn">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
export default Home
