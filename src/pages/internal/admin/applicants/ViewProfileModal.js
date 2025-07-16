import React, { useState } from "react";
import Modal from "../../../../components/modal/Modal";
import placeholder from "../../../../assets/images/placeholder/img_blank.png";

const ViewProfileModal = ({ show, onHide, user }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const handleImageLoad = (fileId) => {
    setLoadingStates((prev) => ({ ...prev, [fileId]: false }));
  };

  const handleImageError = (fileId) => {
    setLoadingStates((prev) => ({ ...prev, [fileId]: false }));
  };
  const modalClose = () => {
    onHide();
  };
  return (
    <Modal show={show} onHide={modalClose} title={`Profile`} size="fullscreen">
      <div className="row mx-0 g-3">
        <div className="col row mx-0 g-3">
          <div className="input-container">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control form-control-light"
              defaultValue={user?.fullName}
              readOnly
              disabled
            />
          </div>
          <div className="input-container col">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control form-control-light"
              defaultValue={user?.email}
              readOnly
              disabled
            />
          </div>
          <div className="input-container col">
            <label className="form-label">Contact</label>
            <input
              type="text"
              className="form-control form-control-light"
              defaultValue={user?.contact}
              readOnly
              disabled
            />
          </div>
          <div className="input-container">
            <label className="form-label">Resume/CV</label>
            <div className="col-auto">
              <button type="button" className="btn btn-dark ">
                Download
              </button>
            </div>
          </div>
          <div className="input-container">
            <label className="form-label">Skills</label>
            <div className="row mx-0 gap-2 flex-wrap">
              <span className="btn btn-dark col-auto">Graphic designer</span>
              <span className="btn btn-dark col-auto">Logo Designer</span>
              <span className="btn btn-dark col-auto">
                Video Post Editing Specialists
              </span>
              <span className="btn btn-dark col-auto">Sound Editors</span>
              <span className="btn btn-dark col-auto">Video Producers</span>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="input-container">
            <label className="form-label">Portfolio</label>
            <div className="col-12 row mx-0 g-2 overflow-auto">
              <img
                src={placeholder}
                style={{ height: "100px", width: "auto", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProfileModal;
