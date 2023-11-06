import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Loader from 'react-loader-spinner'
import JobItem from '../JobItem'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

const apiJobStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    profileData: '',
    checkBoxInputs: [],
    radioInput: '',
    apiJobStatus: apiJobStatusConstants.initial,
    searchInput: '',
    jobsData: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getJobs = async () => {
    const {radioInput, checkBoxInputs, searchInput} = this.state
    this.setState({apiJobStatus: apiJobStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkBoxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    // console.log(response)
    // console.log(data.jobs)
    if (response.ok) {
      const updatedJobsData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        packagePerAnnum: each.package_per_annum,
        id: each.id,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsData: updatedJobsData,
        apiJobStatus: apiJobStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiJobStatusConstants.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    const data = [await response.json()]
    // console.log(response)
    // console.log(data)
    if (response.ok) {
      const updatedData = data.map(each => ({
        name: each.profile_details.name,
        profileUrl: each.profile_details.profile_image_url,
        shortBio: each.profile_details.short_bio,
      }))
      console.log(updatedData)
      this.setState({
        profileData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  profileShow = () => {
    const {profileData} = this.state
    return (
      <div className="profile-container">
        <img src={profileData[0].profileUrl} alt="profile" />
        <h1>{profileData[0].name}</h1>
        <p>{profileData[0].shortBio}</p>
      </div>
    )
  }

  LoadProfileView = () => this.getProfileDetails()

  renderProfileFailureView = () => (
    <div>
      <button type="button" onClick={this.LoadProfileView}>
        Retry
      </button>
    </div>
  )

  renderProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.profileShow()
      case apiStatusConstants.inProgress:
        return this.renderJobsInProgressView()
      case apiJobStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  onChangeCheckBox = event => {
    const {checkBoxInputs} = this.state
    const inputNotInList = checkBoxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInputs: [...prevState.checkBoxInputs, event.target.id],
        }),
        this.getJobs,
      )
      console.log('This is if case')
      console.log(inputNotInList)
    } else {
      const filteredData = checkBoxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      console.log('this is else case')
      console.log(filteredData)
      this.setState({checkBoxInputs: filteredData}, this.getJobs)
    }
  }

  renderCheckBox = () => (
    <ul className="checkbox-container">
      <h4>Type of Employment</h4>
      {employmentTypesList.map(each => (
        <li className="checkbox-list" key={each.employmentTypeId}>
          <input
            className="input-checkbox"
            type="checkbox"
            id={each.employmentTypeId}
            onChange={this.onChangeCheckBox}
          />
          <label className="label-checkbox" htmlFor={each.employmentTypeId}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onChangeRadioButton = e => {
    console.log(e.target.id)
    this.setState({radioInput: e.target.id}, this.getJobs)
  }

  renderRadioButton = () => (
    <ul>
      <h5>Salary Range</h5>
      {salaryRangesList.map(each => (
        <li key={each.salaryRangeId} className="radio-list">
          <input
            id={each.salaryRangeId}
            type="radio"
            name="option"
            className="radio"
            onChange={this.onChangeRadioButton}
          />
          <label className="radio-label" htmlFor={each.salaryRangeId}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderJobsSuccessView = () => {
    const {jobsData} = this.state
    const jobsLengthStatus = jobsData.length === 0
    return jobsLengthStatus ? (
      <div className="jobs-success-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    ) : (
      <ul className="jobs-success-container">
        {jobsData.map(each => (
          <JobItem eachJob={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderJobsInProgressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  LoadSuccessView = () => {
    this.getJobs()
  }

  renderJobsFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.LoadSuccessView}>
        Retry
      </button>
    </div>
  )

  renderJobStatus = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiJobStatusConstants.success:
        return this.renderJobsSuccessView()
      case apiJobStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiJobStatusConstants.inProgress:
        return this.renderJobsInProgressView()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickEnter = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  onSearchJobs = () => {
    this.getJobs()
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="side-container">
            {this.renderProfileStatus()}
            <hr />
            {this.renderCheckBox()}
            <hr />
            {this.renderRadioButton()}
          </div>
          <div className="main-container">
            <div className="input-container">
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                value={searchInput}
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onClickEnter}
              />
              <button
                type="button"
                className="search-button"
                onClick={this.onSearchJobs}
                data-testid="searchButton"
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobStatus()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
