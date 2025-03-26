import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";

const TransferApplications = ({ data }) => {
  const columns = [
    {
      title: "Name with Initials",
      dataIndex: "nameWithInitials",
      key: "nameWithInitials",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Workplace",
      dataIndex: "workplace",
      key: "workplace",
    },
    {
      title: "Transfer Window",
      dataIndex: "transferWindow",
      key: "transferWindow",
    },
    {
      title: "Preferred Workplaces",
      dataIndex: "preferredWorkplaces",
      key: "preferredWorkplaces",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Eligibility",
      dataIndex: "eligibility",
      key: "eligibility",
    },
    {
      title: "Replacement",
      dataIndex: "replacement",
      key: "replacement",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Transfer Decision Recommendation",
      dataIndex: "transferDecision",
      key: "transferDecision",
    },
    {
      title: "Replacement Officer",
      dataIndex: "replacementOffice",
      key: "replacementOffice",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleAction(record)}>
          View Details
        </Button>
      ),
    },
  ];

  const handleAction = (record) => {
    console.log("View details for:", record);
    // Handle the action (e.g., open a modal with detailed information)
  };

  return <Table columns={columns} dataSource={data} />;
};

export default TransferApplications;