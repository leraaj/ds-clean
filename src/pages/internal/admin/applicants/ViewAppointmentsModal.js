import React, { useEffect, useState } from "react";
import Modal from "../../../../components/modal/Modal";
import useFetchById from "../../../../hooks/useFetchById";
import CustomButton from "../../../../components/button/CustomButton";
import { toast } from "sonner";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";

const ViewAppointmentsModal = ({ show, onHide, id, refresh }) => {
  const { API_URL } = useAuthContext();
  const {
    data: appointment,
    loading: appointmentLoading,
    refresh: appointmentRefresh,
  } = useFetchById({
    path: "appointment",
    id: id,
  });
  useEffect(() => {
    appointmentRefresh();
  }, [refresh, null]);
  const [showMeetingForms, setShowMeetingForms] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const user = appointment?.user;
  const job = appointment?.job;
  const status = appointment?.appointmentStatus;
  const phase = appointment?.phase;
  const complete = appointment?.complete;
  const UPDATE_APPOINTMENT_API = `${API_URL}/api/appointment/${appointment?._id}`;
  const makeApiCall = async (
    url,
    appointmentData,
    successMessage,
    failureMessage
  ) => {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(appointmentData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        toast.success(successMessage);
        refresh();
        modalClose();
      } else {
        toast.error(
          `Failed to create appointment: ${
            data.message || data.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message || error}`);
    }
  };

  const createFinalInterview = async () => {
    const appointmentData = {
      complete: 0,
      appointmentStatus: 1,
      phase: 2,
      initialRemarks: remarks,
      meetingTime,
      meetingLink,
    };
    await makeApiCall(
      UPDATE_APPOINTMENT_API,
      appointmentData,
      "Final interview created successfully.",
      "Failed to create final interview"
    );
  };

  const createTeamBriefingInterview = async () => {
    const appointmentData = {
      complete: 0,
      appointmentStatus: 1,
      phase: 3,
      finalRemarks: remarks,
      meetingTime,
      meetingLink,
    };
    await makeApiCall(
      UPDATE_APPOINTMENT_API,
      appointmentData,
      "Team briefing interview created successfully.",
      "Failed to create team briefing interview"
    );
  };

  const finalizeTeamBriefingInterview = async () => {
    const appointmentData = {
      appointmentStatus: 2,
      phase: 3,
      complete: 1,
      hiringRemarks: remarks,
    };
    await makeApiCall(
      UPDATE_APPOINTMENT_API,
      appointmentData,
      "Applicant hiring process complete",
      "Hiring process failed"
    );
  };

  const rejectFinalInterview = async () => {
    const appointmentData = {
      appointmentStatus: -1,
      phase: 2,
    };
    await makeApiCall(
      UPDATE_APPOINTMENT_API,
      appointmentData,
      "Final interview rejected successfully.",
      "Failed to reject final interview"
    );
  };

  const rejectTeamBriefingInterview = async () => {
    const appointmentData = {
      appointmentStatus: -1,
      phase: 3,
    };
    await makeApiCall(
      UPDATE_APPOINTMENT_API,
      appointmentData,
      "Team briefing interview rejected successfully.",
      "Failed to reject team briefing interview"
    );
  };

  const rejectFinalizeClientInterview = async () => {
    const appointmentData = {
      appointmentStatus: -1,
      phase: 3,
    };
    await makeApiCall(
      UPDATE_APPOINTMENT_API,
      appointmentData,
      "Client interview rejection finalized successfully.",
      "Failed to reject client interview"
    );
  };

  const resetInputs = () => {
    setShowMeetingForms(false);
    setRemarks();
    setMeetingTime();
    setMeetingLink();
  };
  const modalClose = () => {
    resetInputs();
    onHide();
  };
  return appointmentLoading ? (
    ""
  ) : appointment?.appointmentStatus === 2 &&
    appointment?.phase === 1 &&
    appointment?.complete === 0 ? (
    <Modal
      show={show}
      onHide={modalClose}
      title={`Initial Screening`}
      size="md"
      isStatic={true}
      footer={
        <div className="d-flex gap-2">
          {showMeetingForms ? (
            <>
              <CustomButton
                color="secondary"
                label="Back"
                onClick={() => setShowMeetingForms(false)}
              />
              <CustomButton
                color="success"
                label="Schedule Final Interview"
                onClick={createFinalInterview}
                disabled={!remarks || !meetingLink || !meetingTime}
              />
            </>
          ) : (
            <>
              <CustomButton
                color="outline-danger"
                label="Reject"
                onClick={rejectFinalInterview}
                disabled={!remarks}
              />
              <CustomButton
                color="secondary"
                label="Proceed"
                onClick={() => setShowMeetingForms(true)}
                disabled={!remarks}
              />
            </>
          )}
          {appointment?.phase === 3 &&
            appointment?.appointmentStatus === 1 &&
            complete === 0 && (
              <>
                <CustomButton
                  color="outline-danger"
                  label="Reject"
                  onClick={rejectFinalInterview}
                  disabled={!remarks}
                />
                <CustomButton
                  color="secondary"
                  label="Proceed"
                  onClick={() => setShowMeetingForms(true)}
                  disabled={!remarks}
                />
              </>
            )}
        </div>
      }>
      <div className="row gap-3">
        {showMeetingForms ? (
          <>
            <div className="input-container">
              <label className="form-label">Meeting Time</label>
              <input
                type="datetime-local"
                className={`form-control form-control-light`}
                value={meetingTime || ""}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label className="form-label">Meeting Link</label>
              <input
                type="text"
                className={`form-control form-control-light`}
                value={meetingLink || ""}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="input-container">
            <label className="form-label">Remarks</label>
            <textarea
              className={`form-control form-control-light`}
              value={remarks || ""}
              rows={4}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        )}
      </div>
    </Modal>
  ) : appointment?.appointmentStatus === 2 &&
    appointment?.phase === 2 &&
    complete === 0 ? (
    <Modal
      show={show}
      onHide={modalClose}
      title={`Final Interview`}
      size="md"
      isStatic={true}
      footer={
        <div className="d-flex gap-2">
          {showMeetingForms ? (
            <>
              <CustomButton
                color="secondary"
                label="Back"
                onClick={() => setShowMeetingForms(false)}
              />
              <CustomButton
                color="success"
                label="Schedule Client Interview"
                onClick={createTeamBriefingInterview}
                disabled={!remarks || !meetingLink || !meetingTime}
              />
            </>
          ) : (
            <>
              <CustomButton
                color="outline-danger"
                label="Reject"
                onClick={rejectTeamBriefingInterview}
                disabled={!remarks}
              />
              <CustomButton
                color="secondary"
                label="Proceed"
                onClick={() => setShowMeetingForms(true)}
                disabled={!remarks}
              />
            </>
          )}
        </div>
      }>
      <div className="row gap-3">
        {showMeetingForms ? (
          <>
            <div className="input-container">
              <label className="form-label">Meeting Time</label>
              <input
                type="datetime-local"
                className={`form-control form-control-light`}
                value={meetingTime || ""}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label className="form-label">Meeting Link</label>
              <input
                type="text"
                className={`form-control form-control-light`}
                value={meetingLink || ""}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="input-container">
            <label className="form-label">Remarks</label>
            <textarea
              className={`form-control form-control-light`}
              value={remarks || ""}
              rows={4}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        )}
      </div>
    </Modal>
  ) : appointment?.appointmentStatus === 2 &&
    appointment?.phase === 3 &&
    complete === 0 ? (
    <Modal
      show={show}
      onHide={modalClose}
      title={`Team Briefing`}
      size="lg"
      isStatic={true}
      footer={
        <div className="d-flex gap-2">
          <>
            <CustomButton
              color="outline-danger"
              label="Reject"
              onClick={rejectFinalizeClientInterview}
              disabled={!remarks}
            />
            <CustomButton
              color="success"
              label="Hired"
              onClick={finalizeTeamBriefingInterview}
              disabled={!remarks}
            />
          </>
        </div>
      }>
      <div className="d-flex gap-3">
        <div className="col row g-3">
          <div className="input-container">
            <label className="form-label">Initial Remarks</label>
            <textarea
              className={`form-control form-control-light`}
              value={appointment?.initialRemarks || ""}
              rows={4}
              onChange={(e) => setRemarks(e.target.value)}
              disabled
              readOnly
            />
          </div>
          <div className="input-container">
            <label className="form-label">Final Remarks</label>
            <textarea
              className={`form-control form-control-light`}
              value={appointment?.finalRemarks || ""}
              rows={4}
              disabled
              readOnly
            />
          </div>
        </div>
        <div className="col row g-3">
          <div className="input-container">
            <label className="form-label">Hiring Remarks</label>
            <textarea
              className={`form-control form-control-light`}
              value={remarks || ""}
              rows={4}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </div>
      </div>
    </Modal>
  ) : phase === 3 && status === 2 && complete === 1 ? (
    <Modal
      show={show}
      onHide={modalClose}
      title={`Hired`}
      size="md"
      isStatic={true}>
      <div className="row gap-3">
        <div className="input-container">
          <label className="form-label">Initial Remarks</label>
          <textarea
            rows={3}
            className="form-control form-control-light"
            value={appointment?.initialRemarks || ""}
          />
        </div>
        <div className="input-container">
          <label className="form-label">Final Remarks</label>
          <textarea
            rows={3}
            className="form-control form-control-light"
            value={appointment?.finalRemarks || ""}
          />
        </div>
        <div className="input-container">
          <label className="form-label">Hiring Remarks</label>
          <textarea
            rows={3}
            className="form-control form-control-light"
            value={appointment?.hiringRemarks || ""}
          />
        </div>
      </div>
    </Modal>
  ) : appointment?.appointmentStatus === 1 &&
    appointment?.phase === 1 &&
    complete === 0 ? (
    <Modal
      show={show}
      onHide={modalClose}
      title={`Awaiting Initial Interview Response`}
      size="md"
      isStatic={true}>
      <div className="row gap-3">
        <p>
          Waiting for {`${user?.fullName}'s`} response for the{" "}
          {`${
            appointment?.appointmentStatus === 1 &&
            appointment?.phase === 1 &&
            complete === 0
              ? "Initial Screening"
              : appointment?.appointmentStatus === 1 &&
                appointment?.phase === 2 &&
                complete === 0
              ? "Final Interview"
              : appointment?.appointmentStatus === 1 &&
                appointment?.phase === 2 &&
                complete === 0
              ? "Team Briefing"
              : ""
          }`}
        </p>
      </div>
    </Modal>
  ) : appointment?.appointmentStatus === 1 &&
    appointment?.phase === 2 &&
    complete === 0 ? (
    <Modal
      show={show}
      onHide={modalClose}
      title={`Waiting Final Interview Response`}
      size="md"
      isStatic={true}>
      <div className="row gap-3">
        <p>
          Waiting for {`${user?.fullName}'s`} response for the{" "}
          {`${
            appointment?.appointmentStatus === 1 &&
            appointment?.phase === 1 &&
            complete === 0
              ? "Initial Screening"
              : appointment?.appointmentStatus === 1 &&
                appointment?.phase === 2 &&
                complete === 0
              ? "Final Interview"
              : appointment?.appointmentStatus === 1 &&
                appointment?.phase === 3 &&
                complete === 0
              ? "Team Briefing"
              : ""
          }`}
        </p>
      </div>
    </Modal>
  ) : appointment?.appointmentStatus === 1 &&
    appointment?.phase === 3 &&
    complete === 0 ? (
    <Modal
      show={show}
      onHide={modalClose}
      title={`Waiting Team Briefing Response`}
      size="md"
      isStatic={true}>
      <div className="row gap-3">
        <p>
          Waiting for {`${user?.fullName}'s`} response for the{" "}
          {`${
            appointment?.appointmentStatus === 1 &&
            appointment?.phase === 1 &&
            complete === 0
              ? "Initial Screening"
              : appointment?.appointmentStatus === 1 &&
                appointment?.phase === 2 &&
                complete === 0
              ? "Final Interview"
              : appointment?.appointmentStatus === 1 &&
                appointment?.phase === 3 &&
                complete === 0
              ? "Team Briefing"
              : ""
          }`}
        </p>
      </div>
    </Modal>
  ) : appointment?.appointmentStatus === -1 ? (
    <Modal
      show={show}
      onHide={modalClose}
      title={`Failed Appointments`}
      size="md"
      isStatic={true}>
      <div className="row gap-3">
        {appointment?.appointmentStatus === -1 && (
          <>
            <p>
              {appointment?.user?.fullName} appointment was rejected{" "}
              {appointment?.phase === 1
                ? "(Initial Screening)"
                : appointment?.phase === 2
                ? "(Final Interview)"
                : appointment?.phase === 3
                ? "(Team Briefing)"
                : ""}
            </p>{" "}
            {appointment?.phase === 2 && JSON.stringify(appointment)}
          </>
        )}
      </div>
    </Modal>
  ) : (
    <Modal
      show={show}
      onHide={modalClose}
      title={`Team Briefing`}
      size="md"
      isStatic={true}>
      <div className="row gap-3"></div>
    </Modal>
  );
};

export default ViewAppointmentsModal;
