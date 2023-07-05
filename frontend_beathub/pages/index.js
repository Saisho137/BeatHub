import React, { useEffect } from 'react';
import Layout from "../components/layout";
import indexStyles from "../styles/index.module.css";

export default function Home() {
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (typeof sessionStorage !== 'undefined') {
        const tokenTimestamp = sessionStorage.getItem('tokenTimestamp');
        if (tokenTimestamp) {
          const currentTimestamp = Date.now();
          const elapsedMilliseconds = currentTimestamp - tokenTimestamp;
          const elapsedHours = elapsedMilliseconds / (1000 * 60 * 60);

          if (elapsedHours >= 1) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('tokenTimestamp');
            alert('Your session has expired. Please login again.');
          }
        }
      }
    };

    checkTokenExpiration();
  }, []);

  const handleClick = (buttonType) => {
    if (typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem('token');
      if (token) {
        if (buttonType === 'recommender') {
          const redirectUrl = '/recommender';
          window.location.href = redirectUrl;
        } else if (buttonType === 'game') {
          const redirectUrl = '/game';
          window.location.href = redirectUrl;
        }
      } else {
        alert('You are not logged in. Please login to access this functionality.');
      }
    }
  };

  return (
    <Layout>
      <div className="container mt-5 pt-5">
        <div className="row text-center">
          <div className={`col-md-6 col-sm-12 ${indexStyles.buttonContainer}`}>
            <button className={`${indexStyles.homeButton1}`} onClick={() => handleClick('recommender')}>Want to find something new?</button>
          </div>
          <div className={`col-md-6 col-sm-12 ${indexStyles.buttonContainer}`}>
            <button className={`${indexStyles.homeButton1}`} onClick={() => handleClick('game')}>Want to play a game?</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}