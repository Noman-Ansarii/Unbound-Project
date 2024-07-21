import React, { useState } from "react";
import { Table, Drawer, Input, Button, Space, Tree, Radio } from "antd";
import { FilterTwoTone } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const { DirectoryTree } = Tree;

const graphColumns = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age" },
  { title: "Address", dataIndex: "address", key: "address" },
  {
    title: "Action",
    key: "action",
    render: () => <a>Delete</a>,
  },
];

const appColumns = [
  { title: "Field", dataIndex: "field", key: "field" },
  { title: "Income", dataIndex: "income", key: "income" },
  { title: "Profit", dataIndex: "profit", key: "profit" },
];

const NestedTree = ({ treeData }) => (
  <DirectoryTree multiple defaultExpandAll treeData={treeData} />
);

const NestedTable = ({ appData, treeData }) => (
  <Table
    columns={appColumns}
    pagination={false}
    dataSource={[appData]} // Ensure data is passed as an array
    size="middle"
    expandable={{
      expandedRowRender: () => <NestedTree treeData={treeData} />,
      rowExpandable: (record) => record.field !== "Not Expandable",
    }}
  />
);

const fetchAPIs = async () => {
  const response = await axios.get(
    "https://noman-ansarii.github.io/iCloud.com/iCloud.com%20(4).json"
  );
  return response.data;
};

const Graph = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["Records"],
    queryFn: fetchAPIs,
  });

  const [open, setOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [incomeFilter, setIncomeFilter] = useState("");
  const [profitFilter, setProfitFilter] = useState("");
  const [ageFilterType, setAgeFilterType] = useState(""); // State for age filter type

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  if (isLoading) {
    return (
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </h1>
    );
  }
  if (error) {
    return <h1>{error.message}</h1>;
  }

  const filteredData = data.filter((item) => {
      const name = item.graphData?.name
        ? item.graphData.name.toLowerCase()
        : "";
      const age = item.graphData?.age ? parseInt(item.graphData.age) : "";
      const address = item.graphData?.address
        ? item.graphData.address.toLowerCase()
        : "";

      const nameMatches = name.includes(nameFilter.toLowerCase());
      const addressMatches = address.includes(addressFilter.toLowerCase());
      const ageMatches =
        ageFilterType === "lessThan"
          ? age <= parseInt(ageFilter)
          : ageFilterType === "greaterThan"
          ? age >= parseInt(ageFilter)
          : age.toString().includes(ageFilter);

      const field = item.appData?.field ? item.appData.field.toLowerCase() : "";
      const income = item.appData?.income
        ? item.appData.income.toLowerCase()
        : "";
      const profit = item.appData?.profit
        ? item.appData.profit.toLowerCase()
        : "";

      const fieldMatches = field.includes(fieldFilter.toLowerCase());
      const incomeMatches = income.includes(incomeFilter.toLowerCase());
      const profitMatches = profit.includes(profitFilter.toLowerCase());

      return (
        nameMatches &&
        ageMatches &&
        addressMatches &&
        fieldMatches &&
        incomeMatches &&
        profitMatches
      );
    })
    .map((item) => {
      const filteredAppData = { ...item.appData };
      const filteredTreeData = {
        ...item.treeData,
        children: item.treeData.children ? [item.treeData.children] : [],
      };

      return { ...item, appData: filteredAppData, treeData: filteredTreeData };
    });

  const handleNameInputChange = (e) => {
    setNameFilter(e.target.value);
  };

  const handleFieldInputChange = (e) => {
    setFieldFilter(e.target.value);
  };

  const handleIncomeInputChange = (e) => {
    setIncomeFilter(e.target.value);
  };

  const handleProfitInputChange = (e) => {
    setProfitFilter(e.target.value);
  };

  const handleAgeInputChange = (e) => {
    setAgeFilter(e.target.value);
  };

  const handleAddressInputChange = (e) => {
    setAddressFilter(e.target.value);
  };

  const handleAgeFilterChange = (e) => {
    const newFilterType = e.target.value;
    if (ageFilterType === newFilterType) {
      setAgeFilterType(""); // Deselect the radio button if clicked again
    } else {
      setAgeFilterType(newFilterType);
    }
  };

  const handleApplyFilters = () => {
    // Optionally, you can apply filters directly here
    // or handle filtering logic as needed
    console.log("Applying filters...");
  };

  const clearFilters = () => {
    setNameFilter("");
    setFieldFilter("");
    setIncomeFilter("");
    setProfitFilter("");
    setAgeFilter("");
    setAddressFilter("");
    setAgeFilterType("");
  };

  return (
    <>
      <div className="filter" style={{ marginTop: "50px" }}>
        <FilterTwoTone
          style={{ fontSize: "25px", float: "right", cursor: "pointer" }}
          onClick={showDrawer}
        />
        <Drawer title="iCloud" onClose={onClose} open={open}>
          <Input
            placeholder="Search Name"
            onChange={handleNameInputChange}
            value={nameFilter}
            style={{ marginTop: "20px" }}
          />
          <Input
            placeholder="Search Field"
            onChange={handleFieldInputChange}
            value={fieldFilter}
            style={{ marginTop: "20px" }}
          />
          <Input
            placeholder="Search Income"
            onChange={handleIncomeInputChange}
            value={incomeFilter}
            style={{ marginTop: "20px" }}
          />
          <Input
            placeholder="Search Profit"
            onChange={handleProfitInputChange}
            value={profitFilter}
            style={{ marginTop: "20px" }}
          />
          <Space direction="vertical" style={{ marginTop: "20px" }}>
            <Radio.Group value={ageFilterType} onChange={handleAgeFilterChange}>
              <Radio.Button value="lessThan">Less than</Radio.Button>
              <Radio.Button value="greaterThan">Greater than</Radio.Button>
            </Radio.Group>
            <Input
              placeholder="Age"
              onChange={handleAgeInputChange}
              value={ageFilter}
            />
            <Input
              placeholder="Address"
              onChange={handleAddressInputChange}
              value={addressFilter}
            />
            <Space direction="horizontal">
              <Button type="primary" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </Space>
          </Space>
        </Drawer>
      </div>
      <Table
        columns={graphColumns}
        expandable={{
          expandedRowRender: (record) => {
            const item = data.find((item) => item.graphData.key === record.key);
            const appData = item.appData;
            const treeData = [
              {
                ...item.treeData,
                children: [item.treeData.children],
              },
            ];
            return <NestedTable appData={appData} treeData={treeData} />;
          },
          rowExpandable: (record) => record.name !== "Not Expandable",
        }}
        pagination={{ showSizeChanger: false }}
        dataSource={filteredData.map((item) => item.graphData)}
      />
    </>
  );
};

export default Graph;
