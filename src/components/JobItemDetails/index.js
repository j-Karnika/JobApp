import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import SimilarJob from '../SimilarJob'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class JobItemDetails extends Component {
  state = {apiStatus: apiStatusConstants.initial, jobData: [], similarJobs: []}

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      const updatedData = [data.job_details].map(each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        id: each.id,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
        lifeAtCompany: {
          description: each.life_at_company.description,
          imageUrl: each.life_at_company.image_url,
        },
        skills: each.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
      }))

      const UpdatedSimilarJobs = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        id: each.id,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobData: updatedData,
        similarJobs: UpdatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {jobData, similarJobs} = this.state
    console.log('This is jobsData')
    console.log(jobData)
    const {
      location,
      companyLogoUrl,
      employmentType,
      jobDescription,
      packagePerAnnum,
      companyWebsiteUrl,
      rating,
      skills,
      title,
      lifeAtCompany,
    } = jobData[0]
    console.log('This is success view')
    return (
      <>
        <div className="job-item-container-new">
          <div className="top-section-container">
            <img src={companyLogoUrl} alt="job details company logo" />
            <div className="top-section">
              <h1>{title}</h1>
              <div>
                <AiFillStar className="star-icon" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-container-main">
            <div className="location-container">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p>{location}</p>
              </div>
              <div>
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="description-container-2">
            <h1 className="heading-jobs">Description</h1>
            <a className="visit-link" href={companyWebsiteUrl}>
              Visit <BiLinkExternal />
            </a>
          </div>
          <p className="description-para">{jobDescription}</p>

          <h1 className="heading-jobs">Skills</h1>
          <ul className="skills-container">
            {skills.map(each => (
              <li className="each-skill-item" key={each.id}>
                <img src={each.imageUrl} alt={each.name} />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="heading-jobs">Life at Company</h1>
          <div className="life-at-company-container">
            <p>{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          <li>
            {similarJobs.map(each => (
              <SimilarJob job={each} key={each.id} />
            ))}
          </li>
        </ul>
      </>
    )
  }

  SuccessView = () => this.getJobDetails()

  renderFailureView = () => {
    console.log('this is failure view')
    return (
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button type="button" onClick={this.SuccessView}>
          Retry
        </button>
      </div>
    )
  }

  renderInProgressView = () => {
    console.log('this. is loader view')
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderInProgressView()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.setState
    console.log(apiStatus)
    return (
      <>
        <Header />
        <div className="job-item-container-main">{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default JobItemDetails
