import React, { useState } from "react";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";
import placeholder from "../../../../assets/images/placeholder/img_blank.png";
import ViewImageModal from "./ViewImageModal";
import UpdateProfileModal from "./UpdateProfileModal";
import "./style.css";
import axios from "axios";
import { toast } from "sonner";
import useFetch from "../../../../hooks/useFetch";

const Profile = () => {
  const { user, API_URL } = useAuthContext();
  const [selectedImage, setSelectedImage] = useState({});
  const {
    data: jobs,
    loading: jobsLoading,
    refresh: jobsRefresh,
  } = useFetch(`${API_URL}/api/jobs?userId=${user?._id}`);
  // ADD MODAL VARIABLES
  const [viewImageModal, setViewImageModal] = useState(null);
  const showImageModal = () => setViewImageModal(true);
  const hideImageModal = () => setViewImageModal(false);

  // UPDATE PROFILE MODAL VARIABLES
  const [updateProfileModal, setUpdateProfileModal] = useState(null);
  const showUpdateProfileModal = () => setUpdateProfileModal(true);
  const hideUpdateProfileModal = () => setUpdateProfileModal(false);

  const [loadingStates, setLoadingStates] = useState({});
  const handleImageLoad = (fileId) => {
    setLoadingStates((prev) => ({ ...prev, [fileId]: false }));
  };

  const handleImageError = (fileId) => {
    setLoadingStates((prev) => ({ ...prev, [fileId]: false }));
  };
  const jobTitles = Array.isArray(jobs)
    ? jobs
        .filter((job) =>
          user?.skills?.some((skill) =>
            typeof skill === "string"
              ? skill === job._id
              : skill?._id === job._id
          )
        )
        .map((job) => job.title)
    : [];
  console.log(`Jobs: ${jobs}`);
  return (
    <>
      <div
        class="profile-container text-center"
        style={{
          borderRadius: "1rem",
          overflow: "hidden",
        }}>
        <div
          className="row gap-4 px-4 "
          style={{
            height: ` 100%`,
            overflowY: `auto` /* Scrollbar inside this element */,
            padding: `1rem`,
          }}>
          <div className="container gap-1">
            <div class="row row-cols-1">
              <div class="col  d-flex justify-content-start align-items-center p-3">
                <iframe
                  title="Uploaded Resume"
                  src={
                    user?.profile?.id
                      ? `https://drive.google.com/file/d/${user?.profile?.id}/preview`
                      : placeholder
                  }
                  className="profile-picture"
                  // allow="autoplay"
                  style={{
                    objectFit: "cover",
                    borderRadius: "1rem",
                    padding: "0rem",
                    border: "none",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
            <div class="row row-cols-2 align-items-center">
              <div class="col text-start p-0 m-0 h4 form-label-light">
                About
              </div>
              {/* <div class="col nav-link text-end">Edit</div> */}
            </div>
            <div class="row row-cols-1">
              <div class="col d-flex justify-content-start">
                <div class="col-12 row m-0 align-items-center ">
                  <div class="col-auto text-start col-form-label ">
                    Fullname:
                  </div>

                  <div class="col ">
                    <input
                      type="text"
                      className={`form-control form-control-light col`}
                      value={user?.fullName}
                      name="fullName"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div class="col d-flex justify-content-start">
                <div class="col-12 row m-0 align-items-center">
                  <div class="col-auto text-start col-form-label">Email:</div>
                  <div class="col ">
                    <input
                      type="text"
                      className={`form-control form-control-light col`}
                      value={user?.email}
                      name="email"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div class="col  d-flex justify-content-start">
                <div class="col-12 row m-0 align-items-center">
                  <div class="col-auto text-start col-form-label">
                    Contact number:
                  </div>
                  <div class="col ">
                    <input
                      type="number"
                      className={`form-control form-control-light col`}
                      value={user?.contact}
                      name="contact"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {user?.position != 1 && (
            <>
              <div className="container gap-1">
                <div class="row row-cols-2 align-items-center">
                  <div class="col text-start p-0 m-0 h4 form-label-light">
                    Resume
                  </div>
                  {/* <div class="col nav-link text-end">Edit</div> */}
                </div>
                <div class="row row-cols-2 align-items-center">
                  <div class="col d-flex justify-content-start">
                    <div class="col-12 row m-0 align-items-center">
                      <div class="col-auto text-start col-form-label">
                        Filename:
                      </div>
                      <div class="col text-start">
                        {user?.resume?.name || "Upload one?"}
                      </div>
                    </div>
                  </div>
                  <div class="col d-flex justify-content-end">
                    <a
                      className="btn btn-sm btn-primary col-auto"
                      href={`https://drive.google.com/uc?export=download&id=${user?.resume?.id}`}>
                      Download
                    </a>
                  </div>
                </div>
              </div>
              <div className="container gap-1">
                <div class="row row-cols-2 align-items-center">
                  <div class="col text-start p-0 m-0 h4 form-label-light">
                    Skills
                  </div>
                  {/* <div class="col nav-link text-end">Edit</div> */}
                </div>
                <div class="row m-0 g-1 gap-1 p-2 flex-wrap overflow-auto">
                  {jobsLoading ? (
                    <span className="text-muted">Loading...</span>
                  ) : jobTitles.length > 0 ? (
                    jobTitles.map((title, index) => (
                      <div
                        key={index}
                        class="btn btn-dark col-auto rounded-pill ">
                        {title}
                      </div>
                    ))
                  ) : (
                    <span className="text-muted">No matched jobs</span>
                  )}
                </div>
              </div>
              <div className="container gap-1">
                <div class="row row-cols-2 align-items-center">
                  <div class="col text-start p-0 m-0 h4 form-label-light">
                    Portfolio
                  </div>
                  {/* <div class="col nav-link text-end">Edit</div> */}
                </div>
                <div class="row m-0 gap-1 p-2 flex-wrap">
                  {user?.portfolio?.map((file, index) => {
                    return (
                      // <iframe
                      //   title="Uploaded Resume"
                      //   className="col-auto"
                      //   height={300}
                      //   width={300}
                      //   style={{
                      //     objectFit: "cover",
                      //     borderRadius: "1rem",
                      //     padding: "0rem",
                      //     border: "none",
                      //   }}
                      //   seamless
                      //   onClick={showImageModal}
                      //   onLoad={() => handleImageLoad(file?.id)}
                      //   onError={() => handleImageError(file?.id)}
                      //   src={`https://drive.google.com/file/d/${file?.id}/preview`}
                      //   allow="autoplay"
                      // />
                      <img
                        src={`https://drive.google.com/thumbnail?id=${file?.id}&sz=w500`}
                        className="flex-shrink rounded-3"
                        style={{
                          height: "120px",
                          width: "120px",
                          objectFit: "cover",
                          cursor: "pointer",
                          backgroundColor: "var(--dark-70)",
                          display:
                            loadingStates[file?.id] === false
                              ? "block"
                              : "none",
                        }}
                        onClick={showImageModal}
                        onLoad={() => handleImageLoad(file?.id)}
                        onError={() => handleImageError(file?.id)}
                      />
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <UpdateProfileModal
        show={updateProfileModal}
        onHide={hideUpdateProfileModal}
      />
      <ViewImageModal
        show={viewImageModal}
        onHide={hideImageModal}
        image_id={selectedImage?.id}
        image_name={selectedImage?.name}
      />
    </>
  );
};

export default Profile;
