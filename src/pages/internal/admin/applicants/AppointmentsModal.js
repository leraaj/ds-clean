import React, { useMemo, useState } from "react";
import Modal from "../../../../components/modal/Modal";
import useFetchById from "../../../../hooks/useFetchById";
import dateTimeFormatter from "../../../../hooks/dateTimeFormatter";
import CustomTable from "../../../../components/table/CustomTable";
import CustomButton from "../../../../components/button/CustomButton";
import ViewAppointmentsModal from "./ViewAppointmentsModal";
import useFetch from "../../../../hooks/useFetch";

const AppointmentsModal = ({ show, onHide, isLoading, refresh, user }) => {
  const {
    data: appointments,
    loading: appointmentsLoading,
    refresh: refreshAppointments,
  } = useFetchById({
    path: "view-appointments",
    id: user?.id,
  });
  const [appointmentId, setAppointmentId] = useState(null);
  const [filter, setFilter] = useState("Awaiting user response");

  const statusLabels = {
    awaitingUserResponse: "Awaiting user response",
    undergoingScreening: "Undergoing screening",
    settingUpFinalInterview: "Setting up final interview",
    teamIntroduction: "Team Briefing",
    processComplete: "Process complete",
    failedAppointments: "Failed appointments",
  };

  const filteredData = useMemo(() => {
    if (!appointments || !Array.isArray(appointments)) return [];
    const formatDate = (timestamp) => {
      const { date, formattedTime } = dateTimeFormatter(timestamp);
      return { date, formattedTime };
    };
    const filterCriteria = {
      "Awaiting user response": (app) =>
        app?.appointmentStatus === 1 && app?.complete === 0,
      "Undergoing screening": (app) =>
        app?.appointmentStatus === 2 && app?.phase === 1 && app?.complete === 0,
      "Setting up final interview": (app) =>
        app?.appointmentStatus === 2 && app?.phase === 2 && app?.complete === 0,
      "Team Briefing": (app) =>
        app?.appointmentStatus === 2 && app?.phase === 3 && app?.complete === 0,
      "Process complete": (app) =>
        app?.appointmentStatus === 2 && app?.phase === 3 && app?.complete === 1,
      "Failed appointments": (app) => app?.appointmentStatus === -1,
    };
    return appointments
      .filter((app) => {
        if (filter in filterCriteria) {
          return filterCriteria[filter](app);
        }
        return true;
      })
      .map((app) => ({
        id: app?._id,
        jobTitle: app?.job?.title,
        status: app?.appointmentStatus,
        statusLabel:
          (app?.appointmentStatus === 1 &&
            app?.phase === 1 &&
            app?.complete === 0) ||
          (app?.appointmentStatus === 1 &&
            app?.phase === 2 &&
            app?.complete === 0) ||
          (app?.appointmentStatus === 1 &&
            app?.phase === 3 &&
            app?.complete === 0)
            ? "Awaiting user response"
            : app?.appointmentStatus === 2 &&
              app?.phase === 1 &&
              app?.complete === 0
            ? "Undergoing screening"
            : app?.appointmentStatus === 2 &&
              app?.phase === 2 &&
              app?.complete === 0
            ? `Setting up final interview`
            : app?.appointmentStatus === 2 &&
              app?.phase === 3 &&
              app?.complete === 0
            ? `Hiring Decision`
            : app?.appointmentStatus === 2 &&
              app?.phase === 3 &&
              app?.complete === 1
            ? "Hired"
            : app?.appointmentStatus === -1
            ? "Failed appointments"
            : null,
        appDetails: app,
        userDetails: app?.user,
        jobDetails: app?.job,
        createdAt: `${formatDate(app?.createdAt).date} - ${
          formatDate(app?.createdAt).formattedTime
        }`,
      }));
  }, [appointments, filter]);

  const columns = useMemo(
    () => [
      { accessorKey: "jobTitle", header: "Applied to" },
      { accessorKey: "statusLabel", header: "Status" },
      { accessorKey: "createdAt", header: "Date Created" },
    ],
    [appointments, filter]
  );
  const refreshData = () => {
    refreshAppointments();
    // Refresh Counters
    refreshCountAwaiting();
    refreshInitial();
    refreshFinal();
    refreshBriefing();
    refresh();
  };
  const modalClose = () => {
    setFilter("Awaiting user response");
    onHide();
  };
  const [appmViewModal, setAppmViewModal] = useState(null);
  const showAppmViewModal = () => {
    setAppmViewModal(true);
  };
  const hideAppmViewModal = () => {
    setAppmViewModal(null);
  };

  const { data: countAwaiting, refresh: refreshCountAwaiting } = useFetchById({
    path: "countWaiting",
    id: user?.id,
  });
  const { data: countInitial, refresh: refreshInitial } = useFetchById({
    path: "countInitial",
    id: user?.id,
  });
  const { data: countFinal, refresh: refreshFinal } = useFetchById({
    path: "countFinal",
    id: user?.id,
  });
  const { data: countBriefing, refresh: refreshBriefing } = useFetchById({
    path: "countBriefing",
    id: user?.id,
  });
  return (
    <>
      <Modal
        show={show}
        onHide={modalClose}
        title={`${user?.fullName} - Appointment`}
        size="fullscreen">
        <CustomTable
          data={filteredData}
          columns={columns}
          enableLoading={appointmentsLoading}
          renderTopToolbarCustomActions={() => (
            <div className={"d-flex gap-2"}>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter === "Awaiting user response" ? "dark" : "outline-dark"
                }`}
                onClick={() => {
                  setFilter("Awaiting user response");
                  refreshData();
                }}>
                <span>Awaiting user response</span>{" "}
                {countAwaiting?.count > 0 && (
                  <span class="badge text-bg-danger">
                    {countAwaiting?.count}
                  </span>
                )}
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter === "Undergoing screening" ? "dark" : "outline-dark"
                }`}
                onClick={() => {
                  setFilter("Undergoing screening");
                  refreshAppointments();
                }}>
                <span>Initial Screening</span>{" "}
                {countInitial?.count > 0 && (
                  <span class="badge text-bg-danger">
                    {countInitial?.count}
                  </span>
                )}
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter === "Setting up final interview"
                    ? "dark"
                    : "outline-dark"
                }`}
                onClick={() => {
                  setFilter("Setting up final interview");
                  refreshAppointments();
                }}>
                <span>Final Interview</span>{" "}
                {countFinal?.count > 0 && (
                  <span class="badge text-bg-danger">{countFinal?.count}</span>
                )}
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter === "Team Briefing" ? "dark" : "outline-dark"
                }`}
                onClick={() => {
                  setFilter("Team Briefing");
                  refreshData();
                }}>
                <span>Team Briefing</span>{" "}
                {countBriefing?.count > 0 && (
                  <span class="badge text-bg-danger">
                    {countBriefing?.count}
                  </span>
                )}
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter === "Process complete" ? "dark" : "outline-dark"
                }`}
                onClick={() => {
                  setFilter("Process complete");
                  refreshData();
                }}>
                <span>Hired</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter === "Failed appointments" ? "dark" : "outline-dark"
                }`}
                onClick={() => {
                  setFilter("Failed appointments");
                  refreshData();
                }}>
                <span>Failed appointments</span>
              </button>
            </div>
          )}
          renderRowActions={({ row }) => (
            <div className={"d-flex gap-1"}>
              <CustomButton
                size="sm"
                color="dark"
                label="View"
                onClick={() => {
                  setAppointmentId(row.original.id);
                  setTimeout(() => {
                    showAppmViewModal();
                    // console.log(row.original);
                  }, 100);
                }}
              />
            </div>
          )}
        />
      </Modal>
      <ViewAppointmentsModal
        show={appmViewModal}
        onHide={() => {
          hideAppmViewModal();
          setAppointmentId(null);
        }}
        id={appointmentId}
        refresh={refreshData}
      />
    </>
  );
};

export default AppointmentsModal;
