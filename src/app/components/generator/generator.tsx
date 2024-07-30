"use client";

import { useState } from "react";
import { GeneratorContext } from "./context";

type GeneratorOptions<TKey extends string | number = string> = {
  generator: () => TKey;
  initialKeys?: TKey[];
  openFirstWhenEmpty?: boolean;
};

type GeneratorProps = {
  options: GeneratorOptions;
  children: React.ReactNode;
};

const Generator = ({ children, options }: GeneratorProps) => {
  const [uids, setUids] = useInitialKeys(options);

  const removeDisabled =
    (options.openFirstWhenEmpty ?? false) && uids.length === 1;

  const addItem = () => {
    setUids((uids) => [...uids, options.generator()]);
  };

  const removeItem = (uid: string) => {
    setUids((_uids) => {
      if (options.openFirstWhenEmpty && _uids.length === 1) return _uids;
      return _uids.filter((_uid) => _uid !== uid);
    });
  };

  return (
    <GeneratorContext.Provider
      value={{ uids, addItem, removeItem, removeDisabled }}
    >
      {children}
    </GeneratorContext.Provider>
  );
};

function useInitialKeys(options: GeneratorOptions) {
  const [ids, setIds] = useState(determineInitialKeys(options));
  return [ids, setIds] as const;
}

function determineInitialKeys(options: GeneratorOptions) {
  if (Array.isArray(options.initialKeys) && options.initialKeys.length > 0) {
    return options.initialKeys;
  } else if (options.openFirstWhenEmpty) {
    return [options.generator()];
  }
  return [];
}

export { Generator };
