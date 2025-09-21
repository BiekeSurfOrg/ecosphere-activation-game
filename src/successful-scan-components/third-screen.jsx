import React from "react";

/**
 * This is the static part of screen 1
 * Does not contain the QR-codes
 *
 * @returns JSX
 */
const ThirdScreen = () => {
  return (
    <div className="flex-column">
      <header className="header-image"></header>
      <div className="page-container">
        <h2 className="title-text">Welcome back!</h2>

        <p>
          2 QR codes down one to go! With the S.T.E.M The Ecosphere strategy we
          not only aim to sell more products. We also want to Save Time and Earn
          Money for the customer!
        </p>

        {/* <div className="icons-border">
          <p>The triple win</p>
          <div className="icon-container">
            <div className="single-icons-border">icon</div>
            <div className="single-icons-border">icon</div>
            <div className="single-icons-border">icon</div>
          </div>
        </div> */}

        <img src="./GED Activation -Triple win Partner.svg" />

        <h3 className="subtitle-text">The partner:</h3>
        <p>
          To optimally fulfil the needs of the customer, we count on the
          experise of our partners. In return, they get access to a broad and
          high-value, broad customer base, supported by KBC's intent detection
          algorithms and matchmaking. This means a new source of income via new
          customers with a higher conversion rate.
        </p>

        <p>Scan the other QR codes to win!</p>
      </div>
    </div>
  );
};

export default ThirdScreen;
