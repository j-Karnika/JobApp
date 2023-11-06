import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const JobItem = props => {
  const {eachJob} = props
  const {
    location,
    companyLogoUrl,
    employmentType,
    jobDescription,
    packagePerAnnum,
    id,
    rating,
    title,
  } = eachJob
  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-item-container-old">
        <div className="top-section-container">
          <img src={companyLogoUrl} alt="company logo" />
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
        <h1 className="description">Description</h1>
        <p className="description-para">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobItem
