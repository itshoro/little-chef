import { useContext as reactUseContext } from "react";

function useContext<T>(calleeName: string, contextProvider: React.Context<T>) {
  const context = reactUseContext(contextProvider);

  if (context === null) {
    throw new Error(
      `${calleeName} needs to be placed within a ${contextProvider.displayName} parent.`,
    );
  }

  return context;
}

export { useContext };
