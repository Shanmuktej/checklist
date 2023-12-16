import { Signal, useSignal } from "@preact/signals";
import { Select as AntdSelect } from "antd";
import { DataType } from "./ItemList";

type props = {
  options: DataType[];
  className?: string;
  placeholder: string;
  clearOptions?: () => boolean;
};

export type SelectRefType = {
  clearOptions: () => void;
  selectedItems: string[]
}

export let selectedItems: Signal<null| string[]>

const Select = ({ options, className, placeholder }: props) => {

  selectedItems = useSignal<string[]>([]);

  const filteredOptions = options.filter(
    (type) => !selectedItems.value?.includes(type.key)
  );
  
  const handleChange = (item: any) => {
    selectedItems.value = item;
  };

  return (
    <AntdSelect
      mode="multiple"
      placeholder={placeholder ?? "Inserted are removed"}
      value={selectedItems.value}
      onChange={handleChange}
      className={className}
      options={filteredOptions.map((item) => ({
        value: item.name
      }))}
    />
  );
};

export default Select;
