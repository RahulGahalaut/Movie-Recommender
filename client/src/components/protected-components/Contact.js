import "./Contact.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaPhone, FaEnvelope, } from "react-icons/fa"
export default () => {
  return (
    <div className="developer-container">
      <img className="developer-profile-pic" src="./assets/profile-pic.jpg" />
      <h1>Rahul Gahalaut</h1>
      <div className="developer-info">
        <p>
          I'm a passionate software developer with expertise in React and JavaScript. I enjoy building web applications and creating user-friendly interfaces. With a strong focus on writing clean and maintainable code, I strive to deliver high-quality solutions.
          In my free time, I love exploring new technologies, contributing to open-source projects, and continuously learning to improve my skills. I'm excited about the endless possibilities in the world of software development and enjoy being part of a collaborative and innovative team.
        </p>
        <p>
          If you have any questions or want to collaborate, feel free to reach out to me. I'm always eager to connect with fellow developers and work on interesting projects together.
        </p>
      </div>
      <div className="developer-contact-container">
        <a href={process.env.REACT_APP_CONTACT_LINKEDIN} target="_blank"><FaLinkedin className="contact-icon" /></a>
        <a href={process.env.REACT_APP_CONTACT_GITHUB} target="_blank"><FaGithub className="contact-icon" /></a>
        <a href={`mailto:${process.env.REACT_APP_CONTACT_EMAIL}`} ><FaEnvelope className="contact-icon" /></a>
        <a href={`tel:${process.env.REACT_APP_CONTACT_PHONE}`} ><FaPhone className="contact-icon" /></a>
        <a href={process.env.REACT_APP_CONTACT_INSTAGRAM} target="_blank"><FaInstagram className="contact-icon" /></a>
        <a href={process.env.REACT_APP_CONTACT_FACEBOOK} target="_blank"><FaFacebook className="contact-icon" /></a>
      </div>

    </div>
  )

};
