"use client";

import { useEffect, useState } from "react";
import { GeneratorContext } from "./context";

type GeneratorOptions<TKey = string> = {
  generator: () => TKey;
  initialKeys?: TKey[];
  openFirstWhenEmpty?: boolean;
};

type GeneratorProps = {
  options: GeneratorOptions;
  children: React.ReactNode;
};

const Generator = ({ children, options }: GeneratorProps) => {
  const [uids, addItem, removeItem] = useIdGenerator(options);

  const removeDisabled =
    (options.openFirstWhenEmpty ?? false) && uids.length === 1;

  return (
    <GeneratorContext.Provider
      value={{ uids, addItem, removeItem, removeDisabled }}
    >
      {children}
    </GeneratorContext.Provider>
  );
};

function useIdGenerator(options: GeneratorOptions) {
  const [uids, setUids] = useState<string[]>([]);

  useEffect(() => {
    setUids((uids) => {
      if (uids.length > 0) return uids;

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

  const addItem = () => {
    setUids((uids) => [...uids, options.generator()]);
  };

  const removeItem = (uid: string) => {
    setUids((_uids) => {
      if (options.openFirstWhenEmpty && _uids.length === 1) return _uids;

      return _uids.filter((_uid) => _uid !== uid);
    });
  };

  return [uids, addItem, removeItem] as const;
}

export { Generator };
