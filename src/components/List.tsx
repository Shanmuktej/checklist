import { computed, useSignal } from "@preact/signals";
import type { InputRef, TableProps } from "antd";
import { Button, Flex, Table } from "antd";
import Input from "antd/es/input/Input";
import type {
  ColumnsType,
  SorterResult
} from "antd/es/table/interface";
import axios from 'axios';
import React, { useEffect, useRef } from "react";
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
  const searchRef = useRef(null)
  const sortedInfo = useSignal<SorterResult<ItemType>>({});
  const allData = useSignal<DataType[]>([])
  const searchValue = useSignal<string>("")
  const emptyTableValue: ItemType = {
    name: "string",
    price: 0,
    quantity: 0,
    units: "string",
    image: "string"
  }
  useEffect(() => {
    axios
      .get("https://mocki.io/v1/99d2e61d-e249-4c28-9ab7-000e5b8609a2")
      .then((response) => {
        showSpinner.value = false
        allData.value = response.data
      });
  }, []);

  const filteredCategories = computed(() => {
    let filteredOptions =
      selectedOptions == null || selectedOptions.value?.length == 0
        ? allData.value.map((x) => x.name)
        : selectedOptions.value;
    return allData.value.filter((data) => filteredOptions?.includes(data.name));
  });
  
  const tableValues = computed(() => {
    console.log(filteredCategories.value)
    let allFilteredData = filteredCategories.value.flatMap(x => x.values ?? emptyTableValue)
    allFilteredData = allFilteredData.filter(data => Object.values(data).some(value => value.toString().toLowerCase().includes(searchValue.value.toLowerCase())))
    return allFilteredData
  })

  const handleChange: TableProps<ItemType>["onChange"] = ( _pagination, _filters, sorter ) => {
    sortedInfo.value = sorter as SorterResult<ItemType>
  };

  const handleClearAll = () => {
    sortedInfo.value = {}
    selectedOptions.value = []
    searchValue.value = ""
    searchRef.current = null
  }

  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: ItemType, b: ItemType) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.value.columnKey === "name" ? sortedInfo.value.order : null,
      ellipsis: true,
      className: "w-1/2",
      sortDirections: ["ascend", "descend", "ascend"],
      render: (_text: any, record: ItemType) => (
        <div className="flex flex-row items-center w-1/2">
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
      sortOrder: sortedInfo.value.columnKey === "price" ? sortedInfo.value.order : null,
      ellipsis: true,
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      ellipsis: true,
      sortDirections: ["ascend", "descend", "ascend"],
      render: (_text: any, record: { quantity: any; units: any }) => (
        <>
          {record.quantity} {record.units}
        </>
      ),
    },
    /* {
      title: "Add to Cart",
      key: "itemsInCart",
      render: (_text: any) => (
        <>
          <Button onClick={() => setSortedInfo({})}>-</Button>
          <Button onClick={() => setSortedInfo({})}>+</Button>
        </>
      ),
    }, */
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
        <Input placeholder="Search items" rootClassName="w-1/2" ref={searchRef} onChange={(event:any) => searchValue.value = event.target.value} />
        <Button onClick={handleClearAll} > Clear Filters </Button>
      </Flex>
      <Table
        columns={columns}
        onChange={handleChange}
        dataSource={tableValues.value}
        pagination={{hideOnSinglePage: true}}
      />
    </>
  );
};

export default List;
