import React, { useEffect, useRef } from "react";
import "./modal.css";

const Modal = ({
  show,
  onHide,
  title,
  children,
  onSubmit,
  reset,
  size,
  isStatic,
  isLoading,
  footer,
  submitMessage,
  closeMessage,
}) => {
  const closeModal = () => {
    handleReset();
    onHide();
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    if (onSubmit) {
      onSubmit(); // Call the provided onSubmit function
    }
  };

  const modalVisibility =
    show === null ? "d-none" : show ? "md-show" : "md-hide";
  const isTitleEmpty = title || "No Title";
  const modalSize =
    size == "fullscreen"
      ? "s-fullscreen"
      : size == "xl"
      ? "s-xl"
      : size == "lg"
      ? "s-lg"
      : size == "md"
      ? "s-md"
      : size == "sm"
      ? "s-sm"
      : "";
  const formRef = useRef(null);
  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
  };
  // Add Esc key listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && show && !isStatic) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, isStatic]);
  return (
    <form
      className={`md-form needs-validation`}
      ref={formRef}
      encType="multipart/form-data"
      noValidate
      onSubmit={handleSubmit} // Handle form submission
    >
      <div
        id="md-container"
        className={`${modalVisibility}`}
        onClick={!isStatic ? closeModal : null}>
        <div
          id="md"
          className={`${modalSize}`}
          onClick={(e) => e.stopPropagation()}>
          <div id="md-header">
            <span className={`text-dark ${!title && "text-danger"}`}>
              {isTitleEmpty}
            </span>
            <span class="btn-close" aria-label="Close" onClick={closeModal} />
          </div>
          <div id="md-body">{children}</div>
          <div id="md-footer">
            <span>
              <button type="button" className="btn " onClick={closeModal}>
                {closeMessage || "Cancel"}
              </button>
            </span>
            {footer}
            {onSubmit && (
              <span>
                <button type="submit" className="btn btn-dark">
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm " />
                  ) : (
                    submitMessage || "Save Changes"
                  )}
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Modal;
