import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  message,
  Spin
} from "antd";
import { LoadingOutlined, EnvironmentOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import useUserData from "../../api/useUserData";
import { useNavigate } from "react-router-dom";
import { getLocation } from '../../utils/getLocation';
import getWorkplaces from "../../api/getWorkplaces";

const { Option } = Select;
const UserProfile = ({ user }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const { workplaces } = getWorkplaces();
  
  const [disabled, setDisabled] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const { fetchUserData } = useUserData();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const detectDeviceType = () =>
      /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent);

    setIsMobile(detectDeviceType());
    const deviceType = detectDeviceType();
    console.log(deviceType ? "Mobile" : "Desktop");
  }, []);

const handleLocationClick = () => {
  getLocation(isMobile, form, setLoading, setDisabled, setLocationError);
};

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        dateOfBirth: user.dateOfBirth
          ? dayjs(user.dateOfBirth, "YYYY-MM-DD")
          : null,
        first_appointment_date: user.first_appointment_date
          ? dayjs(user.first_appointment_date, "YYYY-MM-DD")
          : null,
        duty_assumed_date: user.duty_assumed_date
          ? dayjs(user.duty_assumed_date, "YYYY-MM-DD")
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
              {workplaces.map((workplace) => (
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
            <Select placeholder="Select a cadre category">
              <Option value="Divisional Secretary">Divisional Secretary</Option>
              <Option value="Assistant Divisional Secretary">
                Assistant Divisional Secretary
              </Option>
              <Option value="Accountant">Accountant</Option>
              <Option value="Engineer">Engineer</Option>
              <Option value="DP/DDP/ADP">DP/DDP/ADP</Option>
              <Option value="Administrative Officer">
                Administrative Officer
              </Option>
              <Option value="Administrative Grama Niladhari">
                Administrative Grama Niladhari
              </Option>
              <Option value="Development Officer (Public Administration)">
                Development Officer (Public Administration)
              </Option>
              <Option value="Development Officer (Other)">
                Development Officer (Other)
              </Option>
              <Option value="Technical Officer">Technical Officer</Option>
              <Option value="Technical Assistant">Technical Assistant</Option>
              <Option value="Field Officers">Field Officers</Option>
              <Option value="Management Service Officers">
                Management Service Officers
              </Option>
              <Option value="Information & Communication Technology Assistant">
                Information & Communication Technology Assistant
              </Option>
              <Option value="Grama Niladhari">Grama Niladhari</Option>
              <Option value="Translator">Translator</Option>
              <Option value="Office Employment Service Officers">
                Office Employment Service Officers
              </Option>
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
          <div
            className="flex"
            style={{ flex: "1 1 48%", gap: "20px", alignItems: "center" }}
          >
            <Form.Item label="GPS Coordinates">
              <div style={{ display: "flex", gap: 16 }}>
                <Form.Item
                  name="GPS_latitude"
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <Input
                    placeholder="Latitude (e.g., 12.3456)"
                    maxLength={10}
                    disabled={disabled}
                    prefix={<EnvironmentOutlined />}
                    suffix="°N"
                  />
                </Form.Item>

                <Form.Item
                  name="GPS_longitude"
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <Input
                    placeholder="Longitude (e.g., 98.7654)"
                    maxLength={10}
                    disabled={disabled}
                    prefix={<EnvironmentOutlined />}
                    suffix="°E"
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="danger"
                    className="location-button"
                    shape="circle"
                    onClick={handleLocationClick}
                    disabled={loading || disabled}
                    icon={
                      loading ? (
                        <Spin
                          indicator={
                            <LoadingOutlined style={{ color: "#fff" }} spin />
                          }
                        />
                      ) : (
                        <i
                          className="fas fa-map-marker-alt"
                          style={{ fontSize: 20 }}
                        />
                      )
                    }
                  />
                </Form.Item>
              </div>
            </Form.Item>
          </div>

          {locationError && (
            <p style={{ color: "red", marginTop: "10px" }}>{locationError}</p>
          )}
        </div>
 
        <Button type="primary" htmlType="submit" block>
          Update
        </Button>
      </Form>
    </div>
  );
};

export default UserProfile;
