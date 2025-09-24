import React from "react";

/**
 * This is the static part of screen 1
 * Does not contain the QR-codes
 *
 * @returns JSX
 */
const FirstScreen = () => {
  return (
    <div className="flex-column">
      <header className="header-image"></header>
      <div className="page-container">
        <h2 className="title-text">Hi Team Blue Colleague!</h2>

        <p>
          Thanks for joining us on this Group Ecosphere Day. Prepare yourself
          for a day full of Group energy, lots of enthusiasm, inspiration and an
          enlightening view on the future of KBC.
        </p>
        <h3 className="subtitle-text">
          Jour journey starts <span className="light-blue-font">NOW</span>!
        </h3>
        <p>
          Scan the QR-codes throughout the morning sessions during which Johan
          Thijs, Erik Luts and Karen Van De Woestyne will elaborate on the
          Ecosphere strategy to activate to participate and win grand prizes!
          Enjoy your refreshing breakfast. 
          At 9 o’clock we start with our Ecosphere Journey
          which is all about the triple win.
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
          src="./GED Activation -Triple win KBC.svg"
          className="image-styling"
        />

        <h3 className="subtitle-text">KBC:</h3>
        <p>
          {/* The orchestrator of the triple win As an orchestrator, KBC creates
          scalable ecosystems in which the sum of the parts yields more than the
          individual contribu- tions. By seamlessly integrating partners across
          different customer journeys, we can anticipate and fulfill the
          customer’s needs, leading to increased core product sales */}
          As an orchestrator, KBC creates scalable ecosystems in which the sum
          of the parts yields more than the individual contributions. By
          seamlessly integrating partners across different customer journeys, we
          can anticipate and fulfill the customer’s needs, leading to increased
          core product sales.
        </p>

        <p>Scan the other QR codes to win!</p>
      </div>
    </div>
  );
};

export default FirstScreen;
