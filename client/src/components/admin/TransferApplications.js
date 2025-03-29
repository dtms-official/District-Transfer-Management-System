import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Select, Input, Tooltip, message } from 'antd';
import axios from 'axios';
import useCheckAdminAuth from "../../utils/checkAdminAuth";

const renderStatus = (user) => (
  <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
    <Tooltip title="Checked">
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: user.isChecked ? "orange" : "#d3d3d3",
        }}
      ></div>
    </Tooltip>
    <Tooltip title="Recommended">
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: user.isRecommended ? "blue" : "#d3d3d3",
        }}
      ></div>
    </Tooltip>
    <Tooltip title="Approved">
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: user.isApproved ? "green" : "#d3d3d3",
        }}
      ></div>
    </Tooltip>
    <Tooltip title="Rejected">
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: user.isRejected ? "red" : "#d3d3d3",
        }}
      ></div>
    </Tooltip>
  </div>
);

const TransferApplications = () => {
  const { adminData } = useCheckAdminAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get admin role and workplace ID from adminData
  const adminRole = adminData?.adminRole || null;

  // Fetch the transfer applications data
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    
        if (!token) {
          message.error("Unauthorized! Please log in as an admin.");
          return;
        }
        
    const fetchApplications = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/admin/total-transfer-application`, 
            {  headers: { Authorization: `Bearer ${token}` } }
          );
          setApplications(response.data);
        } catch (error) {
          message.error(error.response?.data?.error || "Something went wrong, try again later");
        } finally {
          setLoading(false);
        }
      };      
  
    fetchApplications();
  }, []);
  
  const calculateEligibility = (transferDate) => {
    const currentDate = new Date();
    const transferDateObj = new Date(transferDate);
  
    let yearsDifference = currentDate.getFullYear() - transferDateObj.getFullYear();
  
    const isBeforeAnniversary = 
      currentDate.getMonth() < transferDateObj.getMonth() || 
      (currentDate.getMonth() === transferDateObj.getMonth() && currentDate.getDate() < transferDateObj.getDate());
  
    if (isBeforeAnniversary) {
      yearsDifference--;
    }
  
    return yearsDifference;
  };

  const handleEdit = (record) => {
    console.log('Edit record:', record);
  };

  const handleAction = async (record, actionType, value) => {
    try {
        const urlMap = {
            check: `${process.env.REACT_APP_API_URL}/admin/check-applcation/${record.id}`,
            recommend: `${process.env.REACT_APP_API_URL}/admin/recommend-applcation/${record.id}`,
            approve: `${process.env.REACT_APP_API_URL}/admin/approve-applcation/:${record.id}`,
            reject: `${process.env.REACT_APP_API_URL}/admin/reject-applcation/${record.id}`,
          };
          
  
      const url = urlMap[actionType];
      if (!url) return;
  
      const requestData = (actionType === "approve" || actionType === "reject") ? { value } : {};
  
      const response = await axios.post(url, requestData);
      if (response.data.success) {
        message.success(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} action completed successfully`);
        setApplications(prev =>
          prev.map(app => app.id === record.id ? { ...app, [`is${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`]: true } : app)
        );
      }
    } catch (error) {
      message.error(error.response?.data?.error || "Something went wrong, try again later");
    }
  };
  
  const columns = [
    {
      title: 'Name with Initials',
      dataIndex: 'transferWindowId',
      key: 'transferWindowId',
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
    },
    ...(adminRole === 'superAdmin' ? [
      {
        title: 'Workplace',
        dataIndex: 'workplace',
        key: 'workplace',
      }
    ] : []),
    {
      title: 'Transfer Window',
      dataIndex: 'transferWindow',
      key: 'transferWindow',
    },
    {
      title: "Preferred Workplaces",
      dataIndex: "preferredWorkplaces",
      key: "preferredWorkplaces",
      render: (preferences) => (
        <div style={{ whiteSpace: "nowrap" }}>
          {preferences?.[0] && <div>1st: {preferences[0]}</div>}
          {preferences?.[1] && <div>2nd: {preferences[1]}</div>}
          {preferences?.[2] && <div>3rd: {preferences[2]}</div>}
        </div>
      ),
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Eligibility (Years)',
      dataIndex: 'eligibility',
      key: 'eligibility',
      render: (text, record) => (
        <>
          {calculateEligibility(record.transferDate)}
          
          {adminRole === "approveAdmin" && (
            <Select
              disabled={record.isApproved || record.isRejected}
              defaultValue={record.isApproved ? "Yes" : "No"}
              onChange={(value) => handleAction(record, "approve", value)}
            >
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          )}

          {(adminRole === "checkingAdmin" || adminRole === "recommendAdmin") && (
            <Input
              placeholder="Enter your details"
              disabled={record.isChecked || record.isRecommended} 
              onBlur={(e) => handleAction(record, "checkOrRecommend", e.target.value)}
            />
          )}
        </>
      ),
    },
    {
      title: 'Replacement',
      dataIndex: 'replacement',
      key: 'replacement',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => renderStatus(record),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: 'Transfer Decision Recommendation',
      dataIndex: 'transferDecisionRecommendation',
      key: 'transferDecisionRecommendation',
    },
    {
      title: 'Replacement Officer',
      dataIndex: 'replacementOfficer',
      key: 'replacementOfficer',
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 250,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          {/* Checking Admin & Recommend Admin */}
          {(adminRole === "checkingAdmin" || adminRole === "recommendAdmin") && (
            <>
              <Button
                type="primary"
                disabled={record.isChecked}
                onClick={() => {
                  handleAction(record, "check");
                  record.isChecked = true;
                }}
              >
                {record.isChecked ? "Checked" : "Check"}
              </Button>
  
              <Button
                type="default"
                disabled={record.isRecommended}
                onClick={() => {
                  handleAction(record, "recommend");
                  record.isRecommended = true;
                }}
              >
                {record.isRecommended ? "Recommended" : "Recommend"}
              </Button>
            </>
          )}
  
          {/* Super Admin */}
          {adminRole === "superadmin" && (
            <Button
              type="dashed"
              disabled={record.isProcessed}
              onClick={() => {
                handleAction(record, "process");
                record.isProcessed = true;
              }}
            >
              {record.isProcessed ? "Processed" : "Process"}
            </Button>
          )}
  
          {/* Approval Admin */}
          {adminRole === "approvalAdmin" && (
            <>
              <Button
                type="primary"
                disabled={record.isApproved || record.isRejected}
                onClick={() => {
                  handleAction(record, "approve");
                  record.isApproved = true;
                }}
              >
                {record.isApproved ? "Approved" : "Approve"}
              </Button>
  
              <Button
                type="danger"
                disabled={record.isApproved || record.isRejected}
                onClick={() => {
                  handleAction(record, "reject");
                  record.isRejected = true;
                }}
              >
                {record.isRejected ? "Rejected" : "Not Approve"}
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={applications}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TransferApplications;


