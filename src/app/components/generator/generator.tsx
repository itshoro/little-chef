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
  const [uids, setUids] = useState(determineInitialKeys(options));

  useEffect(() => {
    if (options.openFirstWhenEmpty) {
      setUids([options.generator()]);
    }
  }, [options.openFirstWhenEmpty, options.generator]);

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

function determineInitialKeys(options: GeneratorOptions) {
  if (Array.isArray(options.initialKeys) && options.initialKeys.length > 0) {
    return options.initialKeys;
  }
  // Using uuid as an id generator causes a hydration error. React doesn't gurantee that the client side will be properly hydrated in such a case.
  //  else if (options.openFirstWhenEmpty) {
  //   return [options.generator()];
  // }
  return [];
}

export { Generator };
