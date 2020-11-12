import React from 'react';

import { useContext } from '../SearchContextProvider';
import { UsePageSizeResult } from './types';

function usePageSize(): UsePageSizeResult {
  const {
    search: {
      config: { resultsPerPageParam },
      variables,
    },
  } = useContext();

  const setPageSize = React.useCallback(
    (size: number) => {
      variables.set({ [resultsPerPageParam]: size });
    },
    [variables],
  );

  const pageSize = parseInt(variables.get()[resultsPerPageParam], 10);

  return {
    pageSize: Number.isNaN(pageSize) ? 10 : pageSize,
    setPageSize,
  };
}

export default usePageSize;