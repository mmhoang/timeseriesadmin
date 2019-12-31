import React, { ReactNode } from 'react';
import { useStateAndStorage } from 'app/hooks/useStateAndStorage';
import { HistoryEntry } from 'app/types/HistoryEntry';

type Props = {
  children: ReactNode;
};

type QueryFavoritesContext = {
  queryFavorites: HistoryEntry[];
  setQueryFavorites: (queryFavorites: HistoryEntry[]) => void;
  appendFavoritesEntry: (favoritesEntry: HistoryEntry) => HistoryEntry[];
};

// according to https://kentcdodds.com/blog/how-to-use-react-context-effectively
export const QueryFavoritesContext = React.createContext<
  QueryFavoritesContext | undefined
>(undefined);

export const QueryFavoritesContextProvider: React.FC<Props> = (props: Props) => {
  const [queryFavorites, setQueryFavorites] = useStateAndStorage<HistoryEntry[]>(
    'queryFavorites',
    [],
  );

  const appendFavoritesEntry = (favoritesEntry: HistoryEntry): HistoryEntry[] => {
    const queryIndex = queryFavorites.findIndex(
      entry => entry.query === favoritesEntry.query,
    );

    const cleanHistory =
      queryIndex > -1
        ? [
            ...queryFavorites.slice(0, queryIndex),
            ...queryFavorites.slice(queryIndex + 1),
          ]
        : queryFavorites.slice();

    const newHistory = [favoritesEntry, ...cleanHistory];
    setQueryFavorites(newHistory);

    return newHistory;
  };

  return (
    <QueryFavoritesContext.Provider
      value={{ queryFavorites, setQueryFavorites, appendFavoritesEntry }}
    >
      {props.children}
    </QueryFavoritesContext.Provider>
  );
};
