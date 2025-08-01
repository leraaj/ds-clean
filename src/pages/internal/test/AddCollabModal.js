import React, { useEffect, useRef, useState } from "react";
import Modal from "../../../components/modal/Modal";
import { useAuthContext } from "../../../hooks/context/useAuthContext";
import useFetch from "../../../hooks/useFetch";
import { toast } from "sonner";

const AddGroupModal = ({ show, onHide, socket, io }) => {
  const { user, API_URL } = useAuthContext();
  const COLLABORATION_API = `${API_URL}/api/collaborator`;
  const client = user?._id;

  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedApplicants, setSelectedApplicants] = useState([]);

  const titleRef = useRef(null);
  const jobRef = useRef(null);

  const handleTitle = (e) => setTitle(e.target.value);
  const handleJob = (e) => {
    setSelectedApplicants([]);
    setSelectedJob(e.target.value);
  };

  const { data: categoryData } = useFetch(`${API_URL}/api/categories`);
  const { data: applicants } = useFetch(`${API_URL}/api/applicants`);
  const { data: jobData, loading: jobDataLoading } = useFetch(
    `${API_URL}/api/jobs?userId=${user?._id}`
  );

  const jobApplicantCounts = jobData?.map((job) => {
    const count = applicants?.filter(
      (applicant) => applicant.job && applicant.job._id === job._id
    ).length;
    return { ...job, applicantCount: count };
  });

  // const filteredApplicants = Array.isArray(applicants)
  //   ? applicants.filter(
  //       (applicant) =>
  //         applicant.job &&
  //         applicant.job._id === selectedJob &&
  //         applicant.user &&
  //         applicant.user._id
  //     )
  //   : [];

  const onClose = () => {
    onHide();
    reset();
  };

  const handleSubmit = async () => {
    const data = {
      title,
      client,
      users: selectedApplicants,
      job: selectedJob,
      senderId: user?._id,
    };

    if (title === "" || selectedApplicants.length < 3 || selectedJob === "") {
      titleRef.current.focus();
      toast.error("All fields are required!");
      if (title === "") {
        titleRef.current.focus();
      } else if (selectedApplicants.length < 3) {
        toast.error("Please select at least 3 applicants");
      } else if (selectedJob === "") {
        jobRef.current.focus();
      }
      return;
    }

    try {
      const response = await fetch(COLLABORATION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.status === 400) {
        const error = await response.json();
        titleRef.current.focus();
        return toast.warning(error.message);
      }

      onClose();
      socket.emit("new_collaborator", {
        message: "Adding new collaborator",
        collaborator_title: title,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    setTitle("");
    setSelectedCategory("");
    setSelectedJob("");
    setSelectedApplicants([]);
    titleRef.current.value = "";
    jobRef.current.value = "";
  };
  const filteredApplicants = Array.isArray(applicants)
    ? applicants
        .filter(
          (app) =>
            app.job &&
            app.job._id &&
            app.user &&
            app.user._id &&
            app.job._id === selectedJob
        )
        .map((app) => {
          const userId = app.user._id;
          const userFullName = app.user.fullName;

          // Find all jobs this applicant applied to
          const jobsOfUser = applicants
            .filter((a) => a.user?._id === userId && a.job?.title)
            .map((a) => a.job.title);

          return {
            userId,
            fullName: userFullName,
            jobTitles: [...new Set(jobsOfUser)], // Remove duplicates
          };
        })
    : [];

  return (
    <Modal
      show={show}
      onHide={onClose}
      title="Start a New Collaboration"
      onSubmit={handleSubmit}
      reset={reset}
      size={"fullscreen"}>
      <div className="row m-0 g-2">
        <section className="col-12 col-lg-12">
          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control form-control-light"
              onChange={handleTitle}
              ref={titleRef}
              required
            />
          </div>

          {/* JOB */}
          <div className="mb-3">
            <label className="form-label">Job</label>
            <div className="d-flex gap-2 col-12">
              <div className="col">
                <select
                  className="form-control form-control-light"
                  onChange={handleJob}
                  ref={jobRef}
                  required>
                  <option value="">Select Job</option>
                  {jobDataLoading ? (
                    <option disabled>Loading...</option>
                  ) : (
                    jobApplicantCounts?.map((job) => (
                      <option key={job._id} value={job._id}>
                        {job.title}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="col-12 row m-0 p-0">
          {/* Selected Applicants */}
          <div className="col-12 mb-3">
            <label className="form-label">
              Selected Applicants ({selectedApplicants.length})
            </label>
            <div className="hstack gap-2 px-2 overflow-auto pb-2">
              {selectedApplicants.length > 0 ? (
                selectedApplicants.map((id) => {
                  const applicant = applicants.find(
                    (app) => app.user._id === id
                  );
                  return applicant ? (
                    <div
                      className="col-auto border d-flex justify-content-between rounded-pill p-1"
                      key={id}>
                      <div className="col-auto row align-items-center p-0 m-0 gap-0">
                        <span className="col-auto">
                          {applicant.user.fullName}
                        </span>
                      </div>
                      <div className="col-auto d-flex justify-content-center align-items-center ">
                        <button
                          className="btn btn-sm btn-danger col-auto rounded-pill"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedApplicants((prev) =>
                              prev.filter(
                                (appId) => appId !== applicant.user._id
                              )
                            );
                          }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : null;
                })
              ) : (
                <span>No applicants selected.</span>
              )}
            </div>
          </div>

          {/* Applicants Available */}
          <div className="col-12 mb-3">
            <label className="form-label">Applicants Available</label>
            <div className="vstack gap-2 px-2">
              {selectedJob === "" ? (
                <span>Select a job to view applicants.</span>
              ) : filteredApplicants.length === 0 ? (
                <span>No applicants found for this job.</span>
              ) : (
                filteredApplicants.map((app) => {
                  const isSelected = selectedApplicants.includes(app.userId);
                  return (
                    <div
                      className="d-flex justify-content-between align-items-center"
                      key={app.userId}>
                      <span className="col-auto">
                        {app.fullName}
                        <span
                          className="col-auto text-muted"
                          style={{ fontSize: "0.8rem" }}>
                          {` (${app.jobTitles.join(", ")})`}
                        </span>
                      </span>
                      {!isSelected ? (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedApplicants((prev) => [
                              app.userId,
                              ...prev,
                            ]);
                          }}>
                          Select
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-secondary rounded-pill"
                          disabled>
                          Selected
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default AddGroupModal;
