import { createContext, useContext, useState } from "react";
import { useQuery } from "react-query";
import { Alert } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

import { QUERIES } from "../lib/queries";
import { ENDPOINTS } from "../lib/endpoints";
import { TSearchEngine, TAppDataContext, TSearchInput } from "../types/common";
import Spinner from "../components/spinner";

const data = [{
  id: "001026332474729733297:elhdjihv5ea",
  name: "罗网",
},{
  id: "001026332474729733297:gst2zqs78gj",
  name: "技术社区",
},{
  id: "001026332474729733297:3t2scsclace",
  name: "Sites云盘",
},{
  id: "001026332474729733297:u_uwiuzserc",
  name: "eBooks",
},]

const AppDataContext = createContext<TAppDataContext>({
  engines: data,
  searchInput: {
    engine: null,
    page: null,
    query: null,
  },
  resetSearchInput: () => void 0,
  setSearchInput: () => void 0,
});

const initialSearchInput: TSearchInput = {
  engine: "",
  page: 1,
  query: "",
};

export function useAppData(): TAppDataContext {
  return useContext(AppDataContext);
}

export function AppDataProvider({ children }): JSX.Element {
  const [searchInput, setSearchInput] =
    useState<TSearchInput>(initialSearchInput);
  const router = useRouter();

  // const { isLoading, error, data } = useQuery<TSearchEngine[], Error>(
  //   QUERIES.ENGINES,
  //   () => fetch(ENDPOINTS.ENGINES).then((res) => res.json()),
  //   {
  //     refetchOnWindowFocus: false,
  //     onSuccess: (result) => {
  //       const updateSearchInput = () => {
  //         const locationQuery = new URLSearchParams(window.location.search);
  //         const currentInput: TSearchInput = {
  //           engine:
  //             locationQuery.get("engine") ||
  //             searchInput.engine ||
  //             result[0]?.id ||
  //             initialSearchInput.engine,
  //           query: locationQuery.get("query") || initialSearchInput.query,
  //           page:
  //             parseInt(locationQuery.get("page"), 10) ||
  //             initialSearchInput.page,
  //         };

  //         setSearchInput(currentInput);
  //       };

  //       // create a route handler to update search input state on back/forward click
  //       router.events.on("routeChangeComplete", updateSearchInput);

  //       updateSearchInput();
  //     },
  //   }
  // );

  // if (isLoading) return <Spinner />;

  // if (error) {
  //   return <Alert severity="error">{error.message}</Alert>;
  // }

  if (!data.length) {
    return (
      <Alert severity="error">
        No engines found. Visit{" "}
        <Link href="https://programmablesearchengine.google.com/cse/all">
          https://programmablesearchengine.google.com/cse/all
        </Link>{" "}
        to make one.
      </Alert>
    );
  }

  const resetSearchInput = () => {
    setSearchInput({
      ...searchInput,
      page: initialSearchInput.page,
      query: initialSearchInput.query,
    });
  };

  return (
    <AppDataContext.Provider
      value={{ engines: data, searchInput, resetSearchInput, setSearchInput }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
