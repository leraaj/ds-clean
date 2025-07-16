import React, { useState } from "react";
import Modal from "../../../../components/modal/Modal";
import placeholder from "../../../../assets/images/placeholder/img_blank.png";
const Index = ({ show, onHide, image_id, image_name }) => {
  const isStatic = false;
  const [loadingStates, setLoadingStates] = useState({});
  const handleImageLoad = (fileId) => {
    setLoadingStates((prev) => ({ ...prev, [fileId]: false }));
  };

  const handleImageError = (fileId) => {
    setLoadingStates((prev) => ({ ...prev, [fileId]: false }));
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      title={image_name}
      size={"fullscreen"}
      closeMessage={"Close"}>
      <div className="d-flex justify-content-center" style={{ height: "100%" }}>
        <img
          src={
            `https://drive.google.com/thumbnail?id=${image_id}&sz=w500` ||
            placeholder
          }
          onLoad={() => handleImageLoad(image_id)}
          onError={() => handleImageError(image_id)}
          style={{ objectFit: "cover", height: "100%" }}
        />
      </div>
    </Modal>
  );
};

export default Index;
