import React from "react";

/**
 * Dynamic QR image container
 * @returns JSX
 */
const QRCodeContainer = ({ scannedQRs }) => {

  return (
    <div className="page-container">
      <div className="QR-image-container">
        <img
          src={
            scannedQRs.includes(1)
              ? "./GED Activation -QR with checkmark.svg"
              : "./GED Activation -QR without Checkmark.svg"
          }
          alt={`QR image`}
          style={{ width: "160px" }}
        />
        <p>KBC</p>
      </div>

      <div className="QR-image-container">
        <img
          src={
            scannedQRs.includes(2)
            ? "./GED Activation -QR with checkmark.svg"
            : "./GED Activation -QR without Checkmark.svg"
          }
          alt={`QR image`}
          style={{ width: "160px" }}
        />
        <p>The Customer</p>
      </div>

      <div className="QR-image-container">
        <img
          src={
            scannedQRs.includes(1500)
              ? "./GED Activation -QR with checkmark.svg"
              : "./GED Activation -QR without Checkmark.svg"
          }
          alt={`QR image`}
          style={{ width: "160px" }}
        />
        <p>The partner</p>
      </div>
    </div>
  );
};

export default QRCodeContainer;
