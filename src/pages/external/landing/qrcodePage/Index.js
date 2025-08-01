import React from "react";
import { QRCodeCanvas } from "qrcode.react"; // Updated import

const Index = () => {
  const apkUrl = `https://drive.google.com/uc?export=download&id=1A9mb1SV55P30kGpIIR-iQ3GF1vyVNEEv`;
  // https://drive.google.com/file/d/1A9mb1SV55P30kGpIIR-iQ3GF1vyVNEEv/view?usp=sharing
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Install Our App</h1>
      <p style={styles.description}>
        Scan the QR code below to download and install the app on your mobile
        device.
      </p>
      <QRCodeCanvas value={apkUrl} size={200} style={styles.qrCode} />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: "100dvh",
    paddingBottom: "5rem",
  },
  title: {
    fontSize: "2em",
    marginBottom: "0.5em",
  },
  description: {
    fontSize: "1.2em",
    marginBottom: "1em",
  },
  qrCode: {
    border: "2px solid #000",
    borderRadius: "1.5rem",
    padding: "10px",
  },
};

export default Index;
