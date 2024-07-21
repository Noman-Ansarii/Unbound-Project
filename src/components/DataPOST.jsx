import React from "react";
import { Table, Button, Input, Form } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const fetchData = async () => {
  const response = await fetch("http://localhost:3001/getData");
  return response.json();
};

const postData = async (newRecord) => {
  const response = await fetch("http://localhost:3001/postData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newRecord),
  });
  return response.json();
};

const POSTData = () => {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["fetchData"],
    queryFn: fetchData,
  });

  const [form] = Form.useForm();

  const { mutate, isLoading } = useMutation({
    mutationKey: ["postData"],
    mutationFn: postData,
    onMutate: (newRecord) => {
      // Create a context for the optimistic update
      const previousData = queryClient.getQueryData(["fetchData"]);

      // Optimistically update the cache
      queryClient.setQueryData(["fetchData"], [
        ...previousData,
        { ...newRecord, id: Date.now() } // Temporarily set an id for optimistic update
      ]);

      return { previousData };
    },
    onError: (error, newRecord, context) => {
      // Rollback the optimistic update if mutation fails
      queryClient.setQueryData(["fetchData"], context.previousData);
    },
    onSuccess: (newRecord) => {
      queryClient.invalidateQueries(["fetchData"]);
      form.resetFields();
    },
  });

  const onFinish = (values) => {
    mutate({
      ...values,
    });
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "30px 0",
        }}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="age"
          rules={[{ required: true, message: "Please input your age!" }]}
        >
          <Input placeholder="Age" />
        </Form.Item>
        <Form.Item
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input placeholder="Address" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Add
          </Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record.description}</p>
          ),
          rowExpandable: (record) => record.name !== "Not Expandable",
        }}
      />
    </div>
  );
};

export default POSTData;
