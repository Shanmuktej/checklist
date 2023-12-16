import { DotLottiePlayer } from "@dotlottie/react-player";
import { ReadonlySignal, Signal, computed, useSignal } from "@preact/signals";
import type { TableProps } from "antd";
import { Select as AntdSelect, Button, Flex, Table } from "antd";
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
type WeightUnits = "kg" | "gm"
type LiquidUnits = "ltr" | "ml"
type SolidUnits = "piece" | "dozen"
type ItemType = {
  name: string;
  price: number;
  quantity: number;
  units: WeightUnits | LiquidUnits | SolidUnits;
  image: string;
  cartQuantity?: number;
  cartUnits?:  WeightUnits | LiquidUnits | SolidUnits;
  cartEstimatedPrice?: number;
}
type ItemsInCartType = {
  name: string,
  quantity: ItemType["cartQuantity"],
  units: ItemType["cartUnits"],
  price: ItemType["cartEstimatedPrice"]
}
type SelectOrPriceProps = {
  record: ItemType
}
const List: React.FC = () => {
  const searchRef = useRef(null)
  const sortedInfo = useSignal<SorterResult<ItemType>>({});
  const allData = useSignal<DataType[]>([])
  const searchValue = useSignal<string>("")

  const emptyTableValue: ItemType = {
    name: "string",
    price: 0,
    quantity: 0,
    units: "gm",
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
    let allFilteredData = filteredCategories.value.flatMap(x => x.values ?? emptyTableValue)
    allFilteredData.forEach(data => {
      let currentItem = itemsInCart.value?.find(x => x.name.toLowerCase() == data.name.toLowerCase())
      data.cartQuantity = currentItem == undefined ? 0 : currentItem.quantity
      data.cartUnits = currentItem == undefined ? "gm" : currentItem.units
      data.cartEstimatedPrice = currentItem == undefined ? 0 : currentItem.price
    })
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

  const getPriceInBaseUnits = (record: ItemType) : number => {
    let {price, units } = record
    if(units === "kg" || units === "ltr") return price / 1000
    if(units === "dozen") return price / 12
    else return price
  }

  const getQuantityInBaseUnits = (record: ItemType) : number => {
    let {quantity, units } = record
    if(units === "kg" || units === "ltr") return quantity * 1000
    if(units === "dozen") return quantity * 12
    else return quantity
  }

  const getBaseUnits = (record: ItemType) : "gm" | "ml" | "piece" => {
    let {units } = record
    if(units === "kg") return "gm"
    if(units === "ltr") return "ml"
    if(units === "dozen") return "piece"
    else return units
  }

  function formatPrice(value: number): string {
    if (value % 1 !== 0) {
      return value.toFixed(2).replace(/\.?0+$/, ""); // Removes trailing zeros
    } else {
      return value.toFixed(0);
    }
  }

  const getOptions  = (record: ItemType): ReadonlySignal<Array<{value: number, label: string}>> => computed(() => {
    let options : Array<{value: number, label: string}> = [];
    let basePricePerUnit = getPriceInBaseUnits(record);
    let weightValues = [0.1, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 0.75, 1, 2, 2.5, 3, 3.5, 4, 5]
    let pieceValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 24];
    let liquidValues = [0.25, 0.5, 0.75, 1, 2, 3, 5];
    if(["kg", "gm"].includes(record.units)) {
      options = weightValues.map(weightInKgs => (
        { value: weightInKgs * 1000, label: `${weightInKgs < 1? weightInKgs * 1000 + " gm" : weightInKgs + " kg"} - ₹${formatPrice(weightInKgs * 1000 * basePricePerUnit)}` }
        ))
      } else if(["ltr", "ml"].includes(record.units)) {
        options = liquidValues.map(quantityInLtrs => (
          { value: quantityInLtrs * 1000, label: `${quantityInLtrs < 1? quantityInLtrs * 1000 + " ml" : quantityInLtrs + " ltr"} - ₹${formatPrice(quantityInLtrs * 1000 * basePricePerUnit)}` }
      ))
    } else {
      options = pieceValues.map(pieces => (
        { value: pieces , label: `${pieces % 12 !== 0 ? pieces + " piece" : pieces/12 + " dozen"} - ₹${formatPrice(pieces * basePricePerUnit)}` }
      ))
    }
    options.unshift({value: 0, label: "Remove Item"})
    return options
  });

  const itemsInCart = useSignal<ItemsInCartType[]>([]);
  
  const focus : Signal<boolean> = computed(() => {
    return focus ? true : false
  })

  const ToCart = ({ record }: SelectOrPriceProps) => {
    const showCartValue = useSignal(record.cartQuantity !== 0);
    
    const addItem = () => {
      showCartValue.value = true;
      itemsInCart.value.push({
        name: record.name,
        quantity: getQuantityInBaseUnits(record),
        units: getBaseUnits(record),
        price: getQuantityInBaseUnits(record) * getPriceInBaseUnits(record)
      });
      tableValues.value.forEach(item => {
        if(item.name == record.name) {
          item.cartUnits = getBaseUnits(item),
          item.cartQuantity = getQuantityInBaseUnits(item),
          item.cartEstimatedPrice = getPriceInBaseUnits(item) * getQuantityInBaseUnits(item)
        }
      })
    }
    const removeItem = () => {
      showCartValue.value = false;
      let items = itemsInCart.value.filter(
        (item) => item.name.toLowerCase() !== record.name.toLowerCase()
      );
      itemsInCart.value = items;
      console.log(itemsInCart.value);
      console.log(tableValues.value);
      tableValues.value.forEach((item) => {
        if (item.name.toLowerCase() === record.name.toLowerCase()) {
          (item.cartUnits = record.units),
            (item.cartQuantity = 0),
            (item.cartEstimatedPrice = 0);
        }
      });
      console.log(itemsInCart.value);
    };
    const modifyItemInCart = (item: ItemType, quantity: number) => {
      if (quantity === 0) {
        removeItem();
        return;
      }
      itemsInCart.value.forEach((data) => {
        if (data.name == item.name) {
          data.quantity = quantity;
          data.units = getBaseUnits(item);
          data.price = quantity * getPriceInBaseUnits(record)
        }
      });
      tableValues.value.forEach((data) => {
        if (data.name == item.name) {
          (data.cartQuantity = quantity), (data.cartUnits = getBaseUnits(item));
          data.cartEstimatedPrice = getPriceInBaseUnits(item) * data.cartQuantity;
        }
      });
      console.log(itemsInCart.value);
      console.log(tableValues.value);
    };
    let defaultOption = itemsInCart.value.find(x => x.name === record.name)?.quantity ?? getOptions(record).value.find((x) => x.label.includes(`${record.quantity} ${record.units}`) )?.value
    console.log(defaultOption)
    return (
      <div className="grid justify-items-center">
        {showCartValue.value ? (
          <>
            <AntdSelect
              className="w-full"
              style={{maxWidth:"9rem"}}
              suffixIcon={null}
              optionLabelProp="label"
              defaultValue={defaultOption}
              onChange={(quantity) => modifyItemInCart(record, quantity)}
              options={getOptions(record).value}
            ></AntdSelect>
            {/* <Button onClick={removeItem} className="w-full rounded-full"> - </Button> */}
          </>
        ) : (
          <DotLottiePlayer
            src="./assets/addButton.lottie"
            className="cursor-pointer w-9"
            hover loop onClick={addItem}
          />
        )}
      </div>
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: ItemType, b: ItemType) => a.name.localeCompare(b.name),
      sortOrder:
        sortedInfo.value.columnKey === "name" ? sortedInfo.value.order : null,
      className: "w-1/4",
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
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      ellipsis: true,
      className: "w-1/5",
      sortDirections: ["ascend", "descend", "ascend"],
      render: (_text: any, record: { quantity: any; units: any }) => (
        <>
          {record.quantity} {record.units}
        </>
      ),
    },
    {
      title: "Price (Est.)",
      dataIndex: "price",
      key: "price",
      className: "w-1/6",
      sorter: (a: ItemType, b: ItemType) => a.price - b.price,
      sortOrder:
      sortedInfo.value.columnKey === "price" ? sortedInfo.value.order : null,
      ellipsis: false,
      sortDirections: ["ascend", "descend", "ascend"],
      render: (_text, record: ItemType) => <span>₹{record.price}</span>
    },
    {
      title: () => <p className="text-center">Add to Cart</p>,
      key: "itemsInCart", 
      className: "max-w-xs w-1/3 sm:w-1/5 md:w-1/10 lg:w-1/10",
      render: (_text, record: ItemType) => <ToCart record={record}/>
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
        <Input placeholder="Search items" rootClassName="w-1/2" ref={searchRef} onChange={(event:any) => searchValue.value = event.target.value} />
        <Button onClick={handleClearAll} > Clear Filters </Button>
      </Flex>
      <Table
        rowClassName="h-9 custom-row-hover"
        rootClassName="h-12"
        columns={columns}
        onChange={handleChange}
        dataSource={tableValues.value}
        pagination={{hideOnSinglePage: true}}
      />
    </>
  );
}

export default List;
