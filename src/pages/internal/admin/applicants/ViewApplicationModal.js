import React, { useEffect, useState } from "react";
import Modal from "../../../../components/modal/Modal";
import useFetchById from "../../../../hooks/useFetchById";
import CustomButton from "../../../../components/button/CustomButton";
import { toast } from "sonner";
import useFetch from "../../../../hooks/useFetch";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";

const ViewApplicationModal = ({ show, onHide, id, refresh }) => {
  const { API_URL } = useAuthContext();
  const {
    data: application,
    loading: applicationLoading,
    refresh: applicationRefresh,
  } = useFetchById({
    path: "application",
    id: id,
  });
  const { refresh: applicationsRefresh } = useFetch(
    `${API_URL}/api/applications`
  );
  const { refresh: appointmentsRefresh } = useFetch(
    `${API_URL}/api/appointments`
  );
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingTime, setMeetingTime] = useState("");

  const user = application?.user;
  const job = application?.job;
  const status = application?.applicationStatus;
  const phase = application?.phase;
  const complete = application?.complete;

  const hasPendingApplication =
    application?.phase === 1 &&
    application?.applicationStatus === 1 &&
    application?.complete === 0;
  const hasPendingAppointment =
    application?.phase === 1 &&
    application?.applicationStatus === 2 &&
    application?.complete === 0;
  const appointmentCreated =
    application?.phase === 1 &&
    application?.applicationStatus === 2 &&
    application?.complete === 1;

  const handleMeetingLink = (e) => {
    setMeetingLink(e.target.value);
  };

  const handleMeetingTime = (e) => {
    setMeetingTime(e.target.value);
  };
  const handleApplicationInProgress = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/application/${application?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            phase: 1,
            applicationStatus: 2,
            complete: 0,
          }),
        }
      );
      const fnResponse = await response.json();
      if (response.ok) {
        toast.success("Application request handled successfully.");
        refreshData();
        onHide();
      } else {
        toast.error("Failed to handle application request.");
      }
    } catch (error) {
      toast.error("An error occurred while handling application request.");
    }
  };
  const handleApplicationDone = async () => {
    const applicationData = {
      phase: 1,
      applicationStatus: 2,
      complete: 1,
      meetingLink: meetingLink,
      meetingTime: meetingTime,
    };
    try {
      const response = await fetch(
        `${API_URL}/api/application/${application?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(applicationData),
        }
      );
      const fnResponse = await response.json();
      if (response.ok) {
        toast.success("Application request handled successfully.");
        refreshData();
        onHide();
      } else {
        toast.error("Failed to handle application request.");
      }
    } catch (error) {
      toast.error("An error occurred while handling application request.");
    }
  };
  const handleCreateAppointment = async () => {
    const data = {
      userId: user?._id,
      jobId: job?._id,
      meetingLink: meetingLink,
      meetingTime: meetingTime,
    };
    try {
      const response = await fetch(`${API_URL}/api/appointment `, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const fnResponse = await response.json();
      if (response.ok) {
        console.log(fnResponse);
        handleApplicationDone();
        appointmentsRefresh();
        refreshData();
        onHide();
      } else {
        toast.error("Failed to handle appointment request.");
      }
    } catch (error) {
      toast.error("An error occurred while handling appointment request.");
    }
  };
  const rejectApplication = async () => {
    const data = {
      phase: 1,
      applicationStatus: -1,
      complete: 0,
    };
    try {
      const response = await fetch(
        `${API_URL}/api/application/${application?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      const fnResponse = await response.json();
      if (response.ok) {
        console.log(fnResponse);
        toast.success("Application request handled successfully.");
        refreshData();
        onHide();
      } else {
        toast.error("Failed to handle application request.");
      }
    } catch (error) {
      toast.error("An error occurred while handling application request.");
    }
  };
  const refreshData = () => {
    applicationRefresh();
    applicationsRefresh();
    appointmentsRefresh();
    refresh();
  };
  const modalClose = () => {
    onHide();
    refreshData();
  };
  return (
    <>
      {applicationLoading ? null : hasPendingApplication ? (
        <Modal
          show={show}
          onHide={modalClose}
          title={`Application: ${user?.fullName} for ${job?.title}`}
          size="md"
          footer={
            <>
              <CustomButton
                color="outline-danger"
                label="Decline"
                onClick={() => {
                  rejectApplication();
                  refresh();
                }}
              />
              <CustomButton
                color="success"
                label="Accept"
                onClick={() => {
                  handleApplicationInProgress();
                  refresh();
                }}
              />
            </>
          }>
          <p>
            {user?.fullName} is requesting to apply for the position of{" "}
            {job?.title}.
          </p>
        </Modal>
      ) : hasPendingAppointment ? (
        <Modal
          show={show}
          onHide={onHide}
          title={`Application: ${user?.fullName} for ${job?.title}`}
          size="md"
          footer={
            <CustomButton
              color="success"
              label="Create an Appointment"
              disabled={!meetingLink || !meetingTime}
              onClick={() => {
                handleCreateAppointment();
                refresh();
              }}
            />
          }>
          <div className="row mx-0 g-3">
            <div className="input-container">
              <label className="form-label">Meeting Link</label>
              <input
                type="text"
                className="form-control form-control-light"
                onChange={handleMeetingLink}
              />
            </div>
            <div className="input-container">
              <label className="form-label">Meeting Time</label>
              <input
                type="datetime-local"
                className="form-control form-control-light"
                onChange={handleMeetingTime}
              />
            </div>
          </div>
        </Modal>
      ) : appointmentCreated ? (
        <Modal
          show={show}
          onHide={onHide}
          title={`Application: ${user?.fullName} for ${job?.title}`}
          size="md">
          <p>{user?.fullName} already has an appointment.</p>
        </Modal>
      ) : application?.appplicationStatus === -1 ? (
        <Modal
          show={show}
          onHide={onHide}
          title={`Application: ${user?.fullName} for ${job?.title}`}
          size="md">
          <p>{user?.fullName} cancelled the application.</p>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

export default ViewApplicationModal;
