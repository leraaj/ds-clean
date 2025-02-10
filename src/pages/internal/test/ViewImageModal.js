import React, { useState, useEffect } from "react";
import Modal from "../../../components/modal/Modal";
import { useAuthContext } from "../../../hooks/context/useAuthContext";
import downloadIcon from "../../../assets/icons/download-solid.svg";
import Loader from "../../../components/loader/Loader";

const ViewImageModal = ({ show, onHide, data, resetData }) => {
  const fileId = data?.content;
  const fileName = data?.filename;
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (fileId) {
      fetchGoogleDriveImage(fileId);
    }
  }, [fileId]);

  const fetchGoogleDriveImage = async (fileId) => {
    try {
      const imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
      setImageSrc(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    onHide();
    resetData();
  }; // Extract filename without extension
  const displayFileName = fileName?.replace(/(.*)\.[^.]+$/, "$1");

  // Get file extension in lowercase
  const fileExtension = (
    fileName?.match(/\.([^.]+)$/)?.[1] || ""
  ).toLowerCase();

  return (
    <Modal
      show={show}
      onHide={onClose}
      title={displayFileName}
      closeMessage="Close"
      footer={
        <a href={imageSrc} download={fileName} className="btn btn-primary">
          <img
            src={downloadIcon}
            alt="Download"
            style={{ width: "15px", marginRight: "5px" }}
          />
          Download
        </a>
      }
      //   size="fullscreen"
    >
      <p className="text-break">{JSON.stringify(data)}</p>
      {loading ? (
        <Loader />
      ) : imageSrc ? (
        <img
          src={imageSrc}
          alt={fileName || "Image"}
          style={{
            width: "100%",
            maxHeight: "60vh",
            objectFit: "contain",
            display: "block",
            margin: "auto",
            backgroundColor: fileExtension === "png" ? "black" : "transparent",
          }}
          onLoad={() => setLoading(false)}
        />
      ) : (
        <p>Failed to load image.</p>
      )}
    </Modal>
  );
};

export default ViewImageModal;
