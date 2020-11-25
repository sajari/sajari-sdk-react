/* eslint-disable @typescript-eslint/no-shadow */
import { useCallback, useEffect, useState } from 'react';

import { useContext } from '../SearchContextProvider';
import { defaultConfig } from '../SearchContextProvider/config';
import { Response } from '../SearchContextProvider/controllers';
import { EVENT_RESPONSE_UPDATED, EVENT_VALUES_UPDATED } from '../SearchContextProvider/events';
import useQuery from '../useQuery';
import mapResultFields from '../utils/mapResultFields';
import { UseSearchConfig, UseSearchCustomConfig, UseSearchParams, UseSearchResult } from './types';

function useCustomSearch({ pipeline, variables, fields = {} }: UseSearchCustomConfig): UseSearchResult {
  const [searching, setSearching] = useState(false);
  const searchFn = useCallback(
    (q?: string) => {
      setSearching(true);
      if (q === '') {
        pipeline.clearResponse(variables.get());
      } else {
        if (q) {
          variables.set({ [defaultConfig.qParam]: q });
        }
        pipeline.search(variables.get());
      }
    },
    [pipeline, variables],
  );

  const [searchOutput, setSearchOutput] = useState<Omit<UseSearchResult, 'searching'>>({
    search: searchFn,
    error: null,
  });

  useEffect(() => {
    searchFn();

    return pipeline.listen(EVENT_RESPONSE_UPDATED, (response: Response) => {
      const { time: latency, totalResults } = { time: response?.getTime(), totalResults: response?.getTotalResults() };
      const reqResults = response?.getResults();
      const results = reqResults ? mapResultFields(reqResults, fields) : undefined;

      setSearching(false);
      setSearchOutput((o) => ({ ...o, results, latency, totalResults, error: response?.getError() }));
    });
  }, []);

  useEffect(() => {
    return variables.listen(EVENT_VALUES_UPDATED, () => {
      searchFn();
    });
  }, []);

  return { ...searchOutput, searching };
}

function useNormalSearch({ queryOverride = '', allowEmptySearch = true }: UseSearchConfig): UseSearchResult {
  const [error, setError] = useState<Error | null>(null);
  const { query } = useQuery();
  const {
    search: { searching, response, fields = {}, search: searchFn },
    instant: { search: searchInstantFn, suggestions },
  } = useContext();

  const results = response?.getResults();

  const search = useCallback(
    (q?: string) => {
      if (q !== undefined) {
        searchFn(q);
      } else {
        searchFn(query);
      }
    },
    [query],
  );

  const searchInstant = useCallback((q: string) => searchInstantFn(q), []);

  useEffect(() => {
    if ((queryOverride === '' && allowEmptySearch) || queryOverride !== '') {
      searchFn(queryOverride);
    }
  }, [queryOverride, allowEmptySearch]);

  useEffect(() => {
    if (response) {
      switch (true) {
        case response.isError():
          setError(response.getError()?.error ?? new Error('Something wrong happened.'));
          break;
        case !response.isError():
          setError(null);
          break;
        default:
          break;
      }
    }
  }, [response]);

  return {
    latency: response?.getTime(),
    totalResults: response?.getTotalResults(),
    suggestions: suggestions ?? [],
    results: results ? mapResultFields(results, fields) : undefined,
    search,
    searchInstant,
    searching,
    error,
  };
}

function useSearch(params?: UseSearchParams) {
  if (params !== undefined && typeof params === 'object' && 'pipeline' in params && 'variables' in params) {
    return useCustomSearch(params);
  }
  return useNormalSearch(params || {});
}

export default useSearch;
