import { Modal } from "antd";

const GPSTrackerModal = ({ visible, onClose }) => {
  return (
    <Modal
      title="Select Location"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div style={{ marginTop: 20 }}>
        <p style={{ fontWeight: "bold" }}>
          Follow the steps below to select your preferred location:
        </p>
        <ul>
          <li>Step 1: Watch the video tutorial below for guidance.</li>
          <li>Step 2: Open the map to select your location.</li>
          <li>
            Step 3: After, copy your GPS coordinates, then you can update your
            basic details.
          </li>
        </ul>
      </div>
      <br />
      <iframe
        src="https://www.youtube.com/embed/H1AX9lPQ7RY?si=15wRnEubuKKIWI51"
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="Select Location Guide"
      />
      <br />
      <a
        href="https://www.google.com/maps/@7.2975,81.6820,12z"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#1a73e8", fontSize: "16px" }}
      >
        Open Google Maps
      </a>
      <p style={{ marginTop: 20 }}>
        You can also select your location directly on the map by clicking the
        link above.
      </p>
    </Modal>
  );
};

export default GPSTrackerModal;
