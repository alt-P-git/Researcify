import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { handleLogout } from './handleLogout.js';
import './landingpage.css';
import logo from './icon.png';
import logotext from './logotext.png';
import landingpageimg from './homepageimg.jpeg';
import icongoldpaper from './icon-gold-paper.svg';
import iconblueuser from './icon-blue-user.svg';

function LandingPage() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/landingpage', {
          method: 'GET'
        });
        if (response.status === 401) {
          navigate('/');
        } else {
          const data = await response.json();
          setData(data[0]);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="landing-main-wrapper">
      <div className="landing-container">
        <div className="landing-centered-content">
          <div>
            <img src={iconblueuser} alt="iconblueuser" className="landing-centered-logo" />
            {data.usercnt} Registered users
          </div>
          <div>
            <img src={icongoldpaper} alt="icongoldpaper" className="landing-centered-logo" />
            {data.researchcnt} Uploaded Papers
          </div>
        </div>
        <div className="landing-left-content">
          <div className="landing-logo-class">
            <img src={logotext} alt="Researcify Logo" className="landing-logo" />
            
          </div>
          <div className="landing-text">
            Access to <br />
            1000+ research papers <br />
            for free <br />
            <p><button className='landing-login-btn' onClick={() => navigate("/login")}>Login</button></p>
          </div>
        </div>
        <div className="landing-right-content">
          <img src={landingpageimg} alt="Researcify Logo" className="landing-landingpageimg" />
          <button className="landing-register-btn">
            <Link to="/register">Register Now</Link>
          </button>
        </div>
      </div>

      <div className="landing-subjects-container">
        <h2>Subjects</h2>
        <div className="landing-lists-container">
          <ul>
            <li>Agriculture, Aquaculture & Food Science</li>
            <li>Architecture & Planning</li>
            <li>Art & Applied</li>
            <li>Business, Economics, Finance & Accounting</li>
            <li>Chemistry</li>
            <li>Veterinary Medicine</li>
          </ul>

          <ul>
            <li>Computer Science & Information Technology</li>
            <li>Earth, Space & Environmental Sciences</li>
            <li>Humanities</li>
            <li>Law & Criminology</li>
            <li>Mathematics & Statistics</li>
            <li>Social & Behavioral Sciences</li>
          </ul>

          <ul>
            <li>Life Sciences</li>
            <li>Medicine</li>
            <li>Nursing, Dentist & Healthcare</li>
            <li>Physical Sciences & Engineering</li>
            <li>Psychology</li>
            <li>Nursing, Dentist & Healthcare</li>
          </ul>
        </div>
      </div>

      <footer>
        <p>
          <span className="landing-brand-name">Researchify</span> covers the latest and most exciting scientific discoveries
          and breakthroughs, as well as offers access to thousands <br />
          of research papers from various disciplines and sources. <br />
          <Link to="/register">Register</Link> and join the most innovative community of researchers.<br />
          Already a user? <p><Link to="/login">Click here to login</Link></p>
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;