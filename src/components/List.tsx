import { effect, useSignal } from "@preact/signals";
import type { TableProps } from "antd";
import { Button, Flex, Table } from "antd";
import Input from "antd/es/input/Input";
import type {
  ColumnsType,
  SorterResult
} from "antd/es/table/interface";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { showSpinner } from "./Loader";
import Select, { selectedItems as selectedOptions } from "./Select";

export type DataType = {
  name: string;
  key: string;
  values?: (ItemType)[] | null;
}

type ItemType = {
  name: string;
  price: number;
  quantity: number;
  units: string;
  image: string;
};

const List: React.FC = () => {
  const [sortedInfo, setSortedInfo] = useState<SorterResult<ItemType>>({});
  const allData = useSignal<DataType[]>([])
  const tableData = useSignal<any>([])

  useEffect(() => {
    axios
      .get("https://mocki.io/v1/99d2e61d-e249-4c28-9ab7-000e5b8609a2")
      .then((response) => {
        showSpinner.value = false
        allData.value= response.data
      });
  }, []);

  effect(() => {
    console.log(selectedOptions?.value)
    let filteredCategories = allData.value.filter(data => selectedOptions.value.includes(data.name))
    console.log(filteredCategories.map(x => x.values))
    tableData.value = filteredCategories.flatMap(x => x.values)
  });

  const handleChange: TableProps<ItemType>["onChange"] = ( pagination, filters, sorter ) => {
    console.log("Various parameters", pagination, filters, sorter);
    setSortedInfo(sorter as SorterResult<ItemType>);
  };

  const handleClearAll = () => {
    setSortedInfo({});
    selectedOptions.value = []
    // selectRef?.current?.clearOptions();
  }

  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: ItemType, b: ItemType) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
      className:"w-36",
      sortDirections: ["ascend", "descend", "ascend"],
      render: (_text: any, record: ItemType) => (
        <div className="flex flex-row items-center">
          {/* <Image
            src={record.image}
            width={50}
            wrapperClassName="rounded-full"
            maskClassName="rounded-full"
            rootClassName="rounded-full"
          /> */}
          <div>{record.name}</div>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a: ItemType, b: ItemType) => a.price - b.price,
      sortOrder: sortedInfo.columnKey === "price" ? sortedInfo.order : null,
      ellipsis: true,
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a: { quantity: number }, b: { quantity: number }) =>
        a.quantity - b.quantity,
      sortOrder: sortedInfo.columnKey === "quantity" ? sortedInfo.order : null,
      ellipsis: true,
      sortDirections: ["ascend", "descend", "ascend"],
      render: (_text: any, record: { quantity: any; units: any }) => (
        <>
          {record.quantity} {record.units}
        </>
      ),
    },
    {
      title: "Add to Cart",
      key: "itemsInCart",
      render: (_text: any) => (
        <>
          <Button onClick={() => setSortedInfo({})}>-</Button>
            
          <Button onClick={() => setSortedInfo({})}>+</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Flex
        style={{ marginBottom: 24, width: "100%" }}
        gap="middle"
        align="start"
      >
        <Select
          options={allData.value}
          className="w-full"
          placeholder="Filter type of grocery"
        />
        <Input placeholder="Search items" rootClassName="w-full" />
        <Button onClick={handleClearAll} > Clear All </Button>
      </Flex>
      <Table
        columns={columns}
        onChange={handleChange}
        dataSource={tableData.value}
      />
    </>
  );
};

export default List;
