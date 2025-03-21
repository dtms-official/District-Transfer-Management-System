import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  message,
  Spin,
  Modal,
} from "antd";
import moment from "moment";
import useUserData from "../../api/useUserData";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const UserProfile = ({ user }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [workplaceData, setWorkplaceData] = useState([]);

  const { fetchUserData } = useUserData();

  const [modalVisible, setModalVisible] = useState(false);

  const handleLocationClick = () => {
    setModalVisible(true); // Open the GPStracking modal when location icon is clicked
  };

  useEffect(() => {
    const fetchWorkplaces = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/workplace`
        ); // Uses base URL from React app
        setWorkplaceData(response.data);
      } catch (error) {
        console.error("Error fetching workplaces:", error);
      }
    };

    fetchWorkplaces();
  }, []);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        dateOfBirth: user.dateOfBirth
          ? moment(user.dateOfBirth, "YYYY-MM-DD")
          : null,
        first_appointment_date: user.first_appointment_date
          ? moment(user.first_appointment_date, "YYYY-MM-DD")
          : null,
        duty_assumed_date: user.duty_assumed_date
          ? moment(user.duty_assumed_date, "YYYY-MM-DD")
          : null,
      });

      setLoading(false); // Stop loading after setting the form data
    }
  }, [form, user]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/user/${user._id}`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(response.data.message);
      fetchUserData();
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin
          size="large"
          tip="Loading..."
          style={{ fontSize: "24px", transform: "scale(2)" }} // Enlarges the spinner
        />
      </div>
    );

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item
            label="Name with Initial"
            name="nameWithInitial"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="First Name"
            name="firstName"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Name denoted by Initials"
            name="lastName"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>
          <Form.Item label="NIC" name="NIC" style={{ flex: "1 1 48%" }}>
            <Input
              onChange={(e) => {
                form.setFieldsValue({ NIC: e.target.value.toUpperCase() });
              }}
            />
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item label="Gender" name="gender" style={{ flex: "1 1 48%" }}>
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Date of Birth"
            name="dateOfBirth"
            style={{ flex: "1 1 48%" }}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item label="Address" name="address" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" style={{ flex: "1 1 48%" }}>
            <Input type="email" />
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item
            label="Contact Number"
            name="contactNumber"
            style={{ flex: "1 1 48%" }}
          >
            <Input type="tel" />
          </Form.Item>
          <Form.Item
            label="First Appointment Date"
            name="first_appointment_date"
            style={{ flex: "1 1 48%" }}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item
            label="Workplace"
            name="workplace_id"
            style={{ flex: "1 1 48%" }}
          >
            <Select>
              {workplaceData.map((workplace) => (
                <Option key={workplace._id} value={workplace._id}>
                  {workplace.workplace}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
              label="Designation"
              name="designation"
              style={{ flex: "1 1 48%" }}
            >
              <Select placeholder="Select a designation">
                <Option value="Divisional Secretary">Divisional Secretary</Option>
                <Option value="Assistant Divisional Secretary">Assistant Divisional Secretary</Option>
                <Option value="Accountant">Accountant</Option>
                <Option value="Engineer">Engineer</Option>
                <Option value="DP/DDP/ADP">DP/DDP/ADP</Option>
                <Option value="Administrative Officer">Administrative Officer</Option>
                <Option value="Administrative Grama Niladhari">Administrative Grama Niladhari</Option>
                <Option value="Development Officer (Public Administration)">Development Officer (Public Administration)</Option>
                <Option value="Development Officer (Other)">Development Officer (Other)</Option>
                <Option value="Technical Officer">Technical Officer</Option>
                <Option value="Technical Assistant">Technical Assistant</Option>
                <Option value="Field Officers">Field Officers</Option>
                <Option value="Management Service Officers">Management Service Officers</Option>
                <Option value="Information & Communication Technology Assistant">
                  Information & Communication Technology Assistant
                </Option>
                <Option value="Grama Niladhari">Grama Niladhari</Option>
                <Option value="Translator">Translator</Option>
                <Option value="Office Employment Service Officers">Office Employment Service Officers</Option>
                <Option value="Drivers">Drivers</Option>
              </Select>
            </Form.Item>
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item
            label="Duty Assumed Date"
            name="duty_assumed_date"
            style={{ flex: "1 1 48%" }}
          >
            <DatePicker type="date" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="City" name="city" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item label="Service" name="service" style={{ flex: "1 1 48%" }}>
            <Select>
              <Option value="Sri Lanka Administrative Service">
                Sri Lanka Administrative Service
              </Option>
              <Option
                value="Sri Lanka Engineering Service
"
              >
                Sri Lanka Engineering Service
              </Option>
              <Option value="Sri Lanka Accountants' Service">
                Sri Lanka Accountants' Service
              </Option>
              <Option value="Sri Lanka Planning Service">
                Sri Lanka Planning Service
              </Option>
              <Option value="Sri Lanka Scientific Service">
                Sri Lanka Scientific Service
              </Option>
              <Option value="Sri Lanka Architectural Service">
                Sri Lanka Architectural Service
              </Option>
              <Option value="Sri Lanka Information & Communication Technology Service">
                Sri Lanka Information & Communication Technology Service
              </Option>
              <Option value="Government Translators’ Service">
                Government Translators’ Service
              </Option>
              <Option value="Sri Lanka Librarians’ Service">
                Sri Lanka Librarians’ Service
              </Option>
              <Option value="Development Officers' Service">
                Development Officers' Service
              </Option>
              <Option value="Management Service Officers’ Service">
                Management Service Officers’ Service
              </Option>
              <Option value="Combined Drivers’ Service">
                Combined Drivers’ Service
              </Option>
              <Option value="Office Employees’ Service">
                Office Employees’ Service
              </Option>
              <Option value="Office Employees’ Service">
                Office Employees’ Service
              </Option>
            </Select>
          </Form.Item>
          <Form.Item label="Class" name="class" style={{ flex: "1 1 48%" }}>
            <Select>
              <Option value="Class I">Class I </Option>
              <Option value="Class II">Class II </Option>
              <Option value="Class III">Class III </Option>
            </Select>
          </Form.Item>
        </div>

        {/* New fields */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item
            label="Resident Type"
            name="resident_type"
            style={{ flex: "1 1 48%" }}
          >
            <Select>
              <Option value="Own house">Own house</Option>
              <Option value="Rented">Rented</Option>
              <Option value="Government Accommodation (Quarters)">
                Government Accommodation (Quarters)
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="W&OP No. (optional)"
            name="wop_number"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>
        </div>
        {/* New fields */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Form.Item
            label="Civil Status"
            name="civil_status"
            style={{ flex: "1 1 48%" }}
          >
            <Select>
              <Option value="Single/Never married">Single/Never married</Option>
              <Option value="Married">Married</Option>
              <Option value="Divorced">Divorced</Option>
              <Option value="Legally Separated">Legally Separated</Option>
              <Option value="Widowed">Widowed</Option>
            </Select>
          </Form.Item>
          <div className="flex" style={{ flex: "1 1 48%", gap: "20px" }}>
            <Form.Item label="GPS Longitude" name="GPS_longitude">
              <Input placeholder="GPS longitude" maxLength={10} />
            </Form.Item>

            <Form.Item label="GPS Latitude" name="GPS_latitude">
              <Input placeholder="GPS latitude" maxLength={10} />
            </Form.Item>

            <Form.Item>
              <Button
                icon={<i className="fas fa-map-marker-alt"></i>}
                onClick={handleLocationClick}
                style={{
                  fontSize: "24px",
                  padding: "0",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  color: "#1878ff",
                }}
                className="btn"
              />
            </Form.Item>
          </div>
        </div>

        <>
          {/* <Button type="primary" onClick={handleLocationClick}>
              Add
            </Button> */}
          <Modal
            title="Select Location"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width={800}
          >
            {/* Instruction Text */}
            <div style={{ marginTop: 20 }}></div>
            {/* YouTube iframe for guiding the user */}
            <iframe
              src="https://www.youtube.com/embed/H1AX9lPQ7RY?si=15wRnEubuKKIWI51"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Select Location Guide"
            ></iframe>
            <br></br>
            <p>
              Watch the video above for guidance on how to select your location
              on the map.
            </p>
          </Modal>
        </>
        <Button type="primary" htmlType="submit" block>
          Update
        </Button>
      </Form>
    </div>
  );
};

export default UserProfile;
