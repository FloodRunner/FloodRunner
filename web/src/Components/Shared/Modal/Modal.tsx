import React from "react";
import ReactDOM from "react-dom";
import "./modal-styles.css";

const renderContent = (content) => {
  if (content) {
    return <div className="content">{content}</div>;
  }
};

const renderActions = (actions) => {
  if (actions) {
    return <div className="actions">{actions}</div>;
  }
};

const renderTitle = (title) => {
  if (title) {
    return <div className="header">{title}</div>;
  }
};

function Modal(props) {
  return ReactDOM.createPortal(
    <div onClick={props.onDismiss} className="ui dimmer modals visible active ">
      <div
        onClick={(e) => e.stopPropagation()}
        className="ui transition modal visible active floodrunner-modal"
      >
        {renderTitle(props.title)}
        {renderContent(props.content)}
        {renderActions(props.actions)}
      </div>
    </div>,
    document.querySelector("#modal")
  );
}

export default Modal;
