"use client";

import { Provider } from "react-redux";
import store, { persistor } from "../../store/store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}