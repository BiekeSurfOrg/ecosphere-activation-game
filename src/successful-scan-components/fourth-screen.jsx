import React from "react";

/**
 * This is the static part of screen 1
 * Does not contain the QR-codes
 *
 * @returns JSX
 */
const FourthScreen = () => {
  return (
    <div className="flex-column">
      <header className="header-image"></header>
      <div className="page-container">
        <h2 className="title-text">Thanks for participating!</h2>

        <p>
          We hope you enjoyed! Keep in mind that
          in the Ecosphere strenght lies in the
          network effects. By providing enough
          value to all players, they will continue to
          actively participate. The customer gets
          convienience and relevance. The partner
          gets reach and conversion. KBC
          orchestrate and becomes the customers
          life partner and is top of mind when
          purchasing financial products. Because
          real growth starts where everyone wins.
          Together we increase the "total pie", the
          joint value of ecosystem
        </p>

        {/* <div className="icons-border">
          <p>The triple win</p>
          <div className="icon-container">
            <div className="single-icons-border">icon</div>
            <div className="single-icons-border">icon</div>
            <div className="single-icons-border">icon</div>
          </div>
        </div> */}

        <img src="./image.png" />

        <h3 className="subtitle-text">Claim your prize!</h3>
        <p>
        Choose wisely! Pick one of the great
        prizes at our physical stand! You can find
        us near the auditorium! Please hold your 
        phone ready to show that you scanned
        all QR codes.
        </p>

        <div className="relative p-4 flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg inline-block">
                <QRCodeSVG
                value={qrValue}
                size={128}
                level="H"
                marginSize={4}
                title="winning QR code"
                fgColor="#0d2a50"
                />
            </div>
        </div>

      </div>
    </div>
  );
};

export default FourthScreen;
