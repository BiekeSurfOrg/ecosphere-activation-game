import React from "react";

/**
 * This is the static part of screen 1
 * Does not contain the QR-codes
 *
 * @returns JSX
 */
const SecondScreen = () => {
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
        <img src="./GED Activation -Triple win Customer.svg" />

        <h3 className="subtitle-text">The Customer:</h3>
        <p>
          A seamless, personalised experience through one trusted platform: the
          KBC Mobile. Customers get access to relevant solutions, tailored to
          their intentions and needs, without frustration or interruptions
        </p>

        <p>Scan the other QR codes to win!</p>
      </div>
    </div>
  );
};

export default SecondScreen;
