import React from "react";

/**
 * This is the static part of screen 1
 * Does not contain the QR-codes
 *
 * @returns JSX
 */
const DummyScreen = () => {
  return (
    <div className="flex-column">
      <header className="header-image"></header>
      <div className="page-container">
        <h2 className="title-text">Testing Page</h2>

        <p>
          Successful page test
        </p>

      </div>
    </div>
  );
};

export default DummyScreen;