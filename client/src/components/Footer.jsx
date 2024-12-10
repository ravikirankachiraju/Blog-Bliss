import React from 'react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <> 
    <div className="footer-container">
      <footer className="footer mb-0 pt-5">
        <div className="logo">
          <span id="name">
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#4d718e">
              <path d="M560-570.67v-54.66q33-14 67.5-21t72.5-7q26 0 51 4t49 10v50.66q-24-9-48.5-13.5t-51.5-4.5q-38 0-73 9.5t-67 26.5Zm0 220V-406q33-13.67 67.5-20.5t72.5-6.83q26 0 51 4t49 10v50.66q-24-9-48.5-13.5t-51.5-4.5q-38 0-73 9t-67 27Zm0-110v-54.66q33-14 67.5-21t72.5-7q26 0 51 4t49 10v50.66q-24-9-48.5-13.5t-51.5-4.5q-38 0-73 9.5t-67 26.5Zm-45.33 201.34q48-23.67 94.83-35.5 46.83-11.84 98.5-11.84 37.33 0 75.83 6t69.5 16.67v-418q-33.66-16-70.71-23.67-37.05-7.66-74.62-7.66-51.67 0-100.67 15t-92.66 43v416ZM481.33-160q-50-38-108.66-58.67Q314-239.33 252-239.33q-38.36 0-75.35 9.66-36.98 9.67-72.65 25-22.4 11-43.2-2.33Q40-220.33 40-245.33v-469.34q0-13.66 6.5-25.33Q53-751.67 66-758q43.67-21 90.5-31.5T252-800q61.33 0 119.5 16.33 58.17 16.34 109.83 49.67 51-33.33 108.5-49.67Q647.33-800 708-800q48.79 0 95.23 10.5 46.44 10.5 90.1 31.5 13 6.33 19.84 18 6.83 11.67 6.83 25.33v469.34q0 26.26-21.5 39.96t-43.17.7q-35-16-71.98-25.33-36.99-9.33-75.35-9.33-62 0-119.33 21-57.34 21-107.34 58.33Z"/>
            </svg> BlogBliss
          </span>
          <div className="motto">Empowering Bloggers with High-Quality Content.</div>
        </div>
        <div>
          <h3>HELPFUL LINKS</h3>
          <ul className="links">
            <li><Link to="/Faqs"><i class="fa fa-chevron-right" aria-hidden="true"></i> &nbsp; &nbsp;&nbsp;FAQs</Link></li>
            <li><a href="https://youtu.be/t_ampPStmHE?si=T3_-lOjC3LLpN6eD"><i class="fa fa-chevron-right" aria-hidden="true"></i> &nbsp; &nbsp;&nbsp;How to use?</a></li>
            <li><a href="/feedback"><i class="fa fa-chevron-right" aria-hidden="true"></i> &nbsp; &nbsp;&nbsp;Feedback</a></li>
            <li><a href="/about"><i class="fa fa-chevron-right" aria-hidden="true"></i> &nbsp; &nbsp;&nbsp;About Us</a></li>
          </ul>
        </div>
        <div>
          <h3>GET IN TOUCH</h3>
          <ul className="contact">
            <li><i class="fa fa-envelope" aria-hidden="true"/> blogbliss@gmail.com</li>
            <li><i class="fa fa-envelope" aria-hidden="true"/> chinmaytadela@gmail.com</li>
            <li><i class="fa fa-envelope" aria-hidden="true"/> rohanaerra@gmail.com</li>
            <li><i class="fa fa-envelope" aria-hidden="true"/> ravikirankachiraju@gmail.com</li>
          </ul>
        </div>
        <div>
          <h3>CONNECT WITH US</h3>
          <ul className="social">
            <li><a href="https://x.com/krk_sharma45?t=-ph7yg9pJsjFx35ZFa6QzA&s=09">X</a></li>
            <li><a href="https://www.instagram.com/harshath_gaini?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">Instagram <i class="fab fa-instagram social-icon"></i></a></li>
            <li><a href="#">LinkedIn <i class="fab fa-linkedin social-icon"></i></a></li>
            <li><a href="https://github.com/ravikirankachiraju">Github <i class="bi bi-github"></i></a></li>
          </ul>
        </div>
      </footer>
      <div className="copyright mb-0">
        Copyright © 2024
        </div>
        </div>
    </>
  );
};

export default Footer;

