"use client";

import { useEffect, useState } from "react";
import { GeneratorContext } from "./context";

type GeneratorOptions<TKey extends string | number> = {
  generator: () => TKey;
  initialKeys?: TKey[];
  openFirstWhenEmpty?: boolean;
};

type GeneratorProps<TKey extends string | number> = {
  options: GeneratorOptions<TKey>;
  children: React.ReactNode;
};

const Generator = <TKey extends string | number>({
  children,
  options,
}: GeneratorProps<TKey>) => {
  const [ids, addItem, removeItem] = useIdGenerator<TKey>(options);

  const removeDisabled =
    (options.openFirstWhenEmpty ?? false) && ids.length === 1;

  return (
    <GeneratorContext.Provider
      value={{ ids, addItem, removeItem, removeDisabled }}
    >
      {children}
    </GeneratorContext.Provider>
  );
};

function useIdGenerator<TKey extends string | number>(
  options: GeneratorOptions<TKey>,
) {
  const [ids, setIds] = useState<TKey[]>([]);

  useEffect(() => {
    setIds((ids) => {
      if (ids.length > 0) return ids;

      if (
        Array.isArray(options.initialKeys) &&
        options.initialKeys.length > 0
      ) {
        return options.initialKeys;
      } else if (options.openFirstWhenEmpty) {
        return [options.generator()];
      }
      return [];
    });
  }, [options]);

  const addItem = (after?: number) => {
    setIds((uids) => {
      const newId = options.generator();
      return after === undefined
        ? [...uids, newId]
        : [...uids.slice(0, after + 1), newId, ...uids.slice(after + 1)];
    });
  };

  const removeItem = (id: TKey) => {
    setIds((_ids) => {
      if (options.openFirstWhenEmpty && _ids.length === 1) return _ids;

      const newIds = _ids.filter((_id) => _id !== id);
      return newIds;
    });
  };

  return [ids, addItem, removeItem] as const;
}

export { Generator };
