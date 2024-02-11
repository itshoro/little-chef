"use client";

import * as Ariakit from "@ariakit/react";
import { useState } from "react";
import { useInputContext } from "../Context";

type SelectProps<TOption> = {
  options: {
    items: TOption[];
    filter: (item: TOption, searchValue: string) => boolean;
    toRenderable: (option: TOption) => Renderable;
  };
};

type Renderable = { label: string; value?: string };

const Select = <T,>({ options }: SelectProps<T>) => {
  const [searchValue, setSearchValue] = useState<string>();
  const { name } = useInputContext(Select.name);

  const matches = options.items.filter((option) =>
    options.filter(option, searchValue ?? "")
  );
  const renderableMatches = matches.map((match) => options.toRenderable(match));

  const [selectedItem, setSelectedItem] = useState<Renderable>(
    renderableMatches?.[0]
  );

  return (
    <Ariakit.ComboboxProvider setValue={setSearchValue}>
      <Ariakit.SelectProvider
        setValue={(value) => {
          setSelectedItem(
            renderableMatches.find((match) => match.value === value)!
          );
        }}
        defaultValue={renderableMatches?.[0]?.value}
      >
        <Ariakit.Select
          type="button"
          name={name}
          className="flex justify-between items-center w-full border p-2 rounded-lg"
        >
          <span>{selectedItem?.label}</span>
          <Ariakit.SelectArrow />
        </Ariakit.Select>
        <Ariakit.SelectPopover
          gutter={4}
          sameWidth
          className="relative bg-stone-100 rounded-xl ring-1 ring-black/5 z-50 shadow-md overflow-auto overscroll-contain"
          style={{
            maxHeight: "min(var(--popover-available-height, 300px), 300px)",
          }}
        >
          <div className="bg-white border-b sticky top-0">
            <Ariakit.Combobox
              placeholder="Search..."
              className="rounded-t-xl px-3 py-2 max-w-full"
            />
          </div>
          <Ariakit.ComboboxList className="p-2 flex flex-col gap-1">
            {matches.map((match) => {
              const { label, value } = options.toRenderable(match);
              return (
                <Ariakit.SelectItem
                  key={value}
                  value={value}
                  className="hover:ring-1 focus:ring-1 hover:ring-black focus:ring-black/5 hover:rounded-lg focus:rounded-lg hover:bg-white focus:bg-white p-2 cursor-default"
                  render={<Ariakit.ComboboxItem>{label}</Ariakit.ComboboxItem>}
                />
              );
            })}
          </Ariakit.ComboboxList>
        </Ariakit.SelectPopover>
      </Ariakit.SelectProvider>
    </Ariakit.ComboboxProvider>
  );
};

export { Select };
