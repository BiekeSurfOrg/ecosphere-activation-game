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
        <h2 className="title-text">You found all QR codes!</h2>

        <p>
          In the Ecosphere, the customer is not the end point, but the starting
          point. Partners are not suppliers, but co-architects. And KBC? We
          orchestrate, connect, strengthen and accelerate. Because relative
          growth starts where everyone wins.
        </p>

        {/* <div className="icons-border">
          <p>The triple win</p>
          <div className="icon-container">
            <div className="single-icons-border">icon</div>
            <div className="single-icons-border">icon</div>
            <div className="single-icons-border">icon</div>
          </div>
        </div> */}

        <img
          src="./GED Activation -Triple win Partner.svg"
          className="image-styling"
        />

        <h3 className="subtitle-text">The partner:</h3>
        <p>
          To optimally fulfil the needs of the customer, we count on the
          experise of our partners. In return, they get access to a broad and
          high-value, broad customer base, supported by KBC&apos;s intent
          detection algorithms and matchmaking. This means a new source of
          income via new customers with a higher conversion rate.
        </p>

        <p>Congratulation, you found all codes!</p>
      </div>
    </div>
  );
};

export default ThirdScreen;
