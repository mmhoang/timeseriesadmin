import React, { ReactNode } from 'react';
import { useStateAndStorage } from 'app/hooks/useStateAndStorage';
import { HistoryEntry } from 'app/types/HistoryEntry';

type Props = {
  children: ReactNode;
};

type QueryFavoritesContext = {
  queryFavorites: HistoryEntry[];
  //dialogText: string;
  setQueryFavorites: (queryFavorites: HistoryEntry[]) => void;
  //setDialogText: (dialogText: string) => void;
  appendFavoritesEntry: (favoritesEntry: HistoryEntry) => HistoryEntry[];
  deleteFavoritesEntry: (favoritesEntry: HistoryEntry) => HistoryEntry[];
  editFavoritesEntry: (favoritesEntry: HistoryEntry) => HistoryEntry[];
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
  //const [dialogText, setDialogText] = useState("default text");

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

  const deleteFavoritesEntry = (favoritesEntry: HistoryEntry): HistoryEntry[] => {
    const queryIndex = queryFavorites.findIndex(
      entry => entry.query === favoritesEntry.query,
    );

    const updatedQueryFavorites =
      queryIndex > -1
        ? [
            ...queryFavorites.slice(0, queryIndex),
            ...queryFavorites.slice(queryIndex + 1),
          ]
        : queryFavorites.slice();

    setQueryFavorites(updatedQueryFavorites);

    return updatedQueryFavorites;
  };

  const editFavoritesEntry = (favoritesEntry: HistoryEntry): HistoryEntry[] => {

    return favoritesEntry;
  };

  return (
    <QueryFavoritesContext.Provider
      value={{ queryFavorites, setQueryFavorites, appendFavoritesEntry, deleteFavoritesEntry, editFavoritesEntry }}
    >
      {props.children}
    </QueryFavoritesContext.Provider>
  );
};
