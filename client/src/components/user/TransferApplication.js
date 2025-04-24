import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  Input,
  Button,
  Card,
  Typography,
  message,
  Form,
  notification,
} from "antd";
import getWorkplaces from "../../api/getWorkplaces";
import axios from "axios";
import useUserData from "../../api/useUserData";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

export default function TransferApplicationForm() {
  const [form] = Form.useForm();
  const [transferWindows, setTransferWindows] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [activeWindow, setActiveWindow] = useState(null);
  const { user } = useUserData();
  const { workplaces, fetchWorkplaces } = getWorkplaces();
  const [loading, setLoading] = useState(false);
  const [userApplication, setUserApplication] = useState([]);
  const isSubmited =
    userApplication.length > 0 ? userApplication[0].isSubmited : false;

  const userId = user?._id || null;
  const workplaceId = user?.workplace_id || null;

  const getUserApplication = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/transfer-application/user/${userId}`
      );
      setUserApplication(response.data);
    } catch (error) {
      notification.info({
        description:
          error?.response?.data?.error ||
          "Something went wrong. Please try again.",
        placement: "topRight",
      });
    }
  }, [userId]);

  useEffect(() => {
    if (user) getUserApplication();
  }, [user, getUserApplication]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        transferWindowId: values.transferWindow,
        preferWorkplace_1: values.preferredWorkplace1,
        preferWorkplace_2: values.preferredWorkplace2,
        preferWorkplace_3: values.preferredWorkplace3,
        remarks: values.remarks || "",
        workplace_id: workplaceId,
        userId: userId,
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/transfer-application`,
        { ...payload, userId: user._id }
      );

      form.resetFields();
      message.success("Application submitted successfully!", 2);
      getUserApplication();
    } catch (err) {
      if (Array.isArray(err?.response?.data?.errors)) {
        err.response.data.errors.forEach((e) => message.error(e.msg));
      } else {
        message.error(
          err?.response?.data?.error ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !user.isApproved) {
      notification.error({
        message: "Approval Required",
        description: "You need approval to apply for transfer",
      });
      return;
    }
    fetchWorkplaces();
    fetchTransferWindows();

    if (isSubmited) {
      notification.success({
        description:
          "You have successfully submitted the transfer application. Wait for approval",
      });
    }
  }, [user, fetchWorkplaces, isSubmited]);

  const fetchTransferWindows = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/transfer-window`
      );
      const windows = response.data;
      const active = windows.find(
        (window) =>
          !window.isTerminated &&
          new Date(window.applicationClosingDate) > new Date()
      );
      setActiveWindow(active);
      setTransferWindows(windows);
    } catch (error) {
      message.error(
        error?.response?.data?.error ||
          "Something went wrong. Please try again."
      );
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const closingDate = activeWindow?.applicationClosingDate;
      const formattedDate = dayjs(closingDate).format("YYYY-MM-DD");
      const now = dayjs();
      const diffInSeconds = dayjs(formattedDate).diff(now, "second");

      if (diffInSeconds <= 0) {
        setTimeRemaining("Application closed");
        clearInterval(interval);
        return;
      }

      const dur = dayjs.duration(diffInSeconds, "seconds");
      const d = dur.days();
      const h = dur.hours();
      const m = dur.minutes();
      const s = dur.seconds();

      setTimeRemaining(`${d} Days ${h} Hour, ${m} Min, ${s} Seconds`);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWindow]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6 overflow-hidden">
      <Card className="w-full max-w-xl">
        <Title level={4}>Transfer Application</Title>
        {!user?.isApproved ? (
          <Text type="danger">You need approval to apply for transfer.</Text>
        ) : isSubmited ? (
          <Text type="success">
            You have submitted a transfer application successfully. Wait for the
            approval
          </Text>
        ) : !activeWindow ? (
          <Text type="danger">
            Currently, no active transfer window is available.
          </Text>
        ) : (
          <>
            <Text type="danger" className="text-sm font-bold">
              TRANSFER APPLICATION CLOSING IN:
              {timeRemaining}
            </Text>
            ;
            {!isSubmited && (
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                  label="Select Transfer Window"
                  name="transferWindow"
                  rules={[
                    {
                      required: true,
                      message: "Please select a transfer window",
                    },
                  ]}
                >
                  <Select placeholder="Select a transfer window">
                    {transferWindows
                      .filter(
                        (window) =>
                          !window.isTerminated &&
                          new Date(window.applicationClosingDate) > new Date()
                      )
                      .map((transferWindow) => (
                        <Option
                          key={transferWindow._id}
                          value={transferWindow._id}
                        >
                          {transferWindow.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
                {[
                  "preferredWorkplace1",
                  "preferredWorkplace2",
                  "preferredWorkplace3",
                ].map((field, index) => (
                  <Form.Item
                    key={field}
                    label={`Preferred Workplace (${index + 1})`}
                    name={field}
                    rules={[
                      {
                        required: true,
                        message: `Please select preferred workplace ${
                          index + 1
                        }`,
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select Workplace"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {workplaces
                        .filter(
                          (workplace) =>
                            field === "preferredWorkplace1" ||
                            (field === "preferredWorkplace2" &&
                              workplace._id !==
                                form.getFieldValue("preferredWorkplace1")) ||
                            (field === "preferredWorkplace3" &&
                              workplace._id !==
                                form.getFieldValue("preferredWorkplace1") &&
                              workplace._id !==
                                form.getFieldValue("preferredWorkplace2"))
                        )
                        .map((workplace) => (
                          <Option key={workplace._id} value={workplace._id}>
                            {workplace.workplace}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                ))}
                <Form.Item label="Remarks (Optional)" name="remarks">
                  <TextArea maxLength={350} placeholder="Enter your remarks" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full"
                    loading={loading}
                  >
                    Submit Application
                  </Button>
                </Form.Item>
              </Form>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
