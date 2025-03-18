import { useState, useEffect } from "react";
import { Select, Input, Button, Card, Typography, Form } from "antd";
import getWorkplaces from "../../api/getWorkplaces";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

export default function TransferApplicationForm() {
  const [formData, setFormData] = useState({
    preferredWorkplace1: "Kalmunai",
    preferredWorkplace2: "",
    preferredWorkplace3: "",
    transferWindow: "",
    reason: "",
  });

  const { workplaces, fetchWorkplaces } = getWorkplaces();

  useEffect(() => {
    fetchWorkplaces(); // Fetch workplaces when the component mounts
  }, [fetchWorkplaces]);

  const transferWindows = [
    "Q1 - January to March",
    "Q2 - April to June",
    "Q3 - July to September",
    "Q4 - October to December",
  ];

  const [timeLeft, setTimeLeft] = useState(30 * 24 * 60 * 60); // 30 days in seconds

  useEffect(() => {
    const timer = setInterval(
      () => setTimeLeft((prev) => Math.max(prev - 1, 0)),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (24 * 60 * 60)),
      h = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60)),
      m = Math.floor((seconds % (60 * 60)) / 60);
    return `${d}d ${h}h ${m}m ${seconds % 60}s`;
  };

  const handleChange = (value, name) => {
    if (name === "reason" && value.length > 350) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const filteredWorkplaces = (excludeList) =>
  //   workplaces.filter((place) => !excludeList.includes(place));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6 overflow-hidden">
      <Card
        className="w-full max-w-xl"
        title={<Title level={4}>Transfer Application</Title>}
      >
        <div className="flex justify-between items-center mb-2">
          <Text type="danger">
            Transfer application closing in : {formatTime(timeLeft)}
          </Text>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Text strong>Select Transfer Window</Text>
            <Select
              name="transferWindow"
              value={formData.transferWindow}
              onChange={(value) => handleChange(value, "transferWindow")}
              className="w-full mt-1"
              placeholder="Select a transfer window"
            >
              {transferWindows.map((window, index) => (
                <Option key={index} value={window}>
                  {window}
                </Option>
              ))}
            </Select>
          </div>

          {[
            "preferredWorkplace1",
            "preferredWorkplace2",
            "preferredWorkplace3",
          ].map((field, index) => (
            <div key={index}>
              <Text strong>{`Preferred Workplace (${index + 1})`}</Text>
              <Form.Item
                label="Workplace"
                name="workplace_id"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select
                  placeholder="Select Workplace"
                  style={{ width: "100%" }}
                >
                  {workplaces.map((workplace) => (
                    <Select.Option key={workplace._id} value={workplace._id}>
                      {workplace.workplace}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          ))}

          <div>
            <Text strong>
              Remarks to be considered by transfer board (Optional)
            </Text>
            <TextArea
              name="reason"
              value={formData.reason}
              onChange={(e) => handleChange(e.target.value, "reason")}
              maxLength={350}
              className="w-full mt-1"
            />
          </div>

          <Button type="primary" htmlType="submit" className="w-full mt-4">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
