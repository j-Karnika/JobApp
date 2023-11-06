import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const SimilarJob = props => {
  const {job} = props
  const {
    companyLogoUrl,
    title,
    rating,
    employmentType,
    jobDescription,
    location,
  } = job
  return (
    <li className="similar-jobs-container">
      <div className="top-section-container">
        <img src={companyLogoUrl} alt="similar job company logo" />
        <div className="top-section">
          <h1>{title}</h1>
          <div>
            <AiFillStar className="star-icon" />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="heading-jobs">Description</h1>
      <p>{jobDescription}</p>
      <div className="employment-details">
        <MdLocationOn />
        <p className="location">{location}</p>
        <p>{employmentType}</p>
      </div>
    </li>
  )
}
export default SimilarJob
