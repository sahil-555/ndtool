import React, { createContext, useReducer } from "react";

interface NotifType {
  visible: boolean;
  message: string;
  header: string;
}

const initialState: NotifType = {
  visible: false,
  message: "",
  header: "",
};

const NotifContext = createContext<{
  notif: any;
  notifDispatch: React.Dispatch<any>;
}>({ notif: { ...initialState }, notifDispatch: () => {} });

let reducer = (state: NotifType, action: { type: any; payload: any }) => {
  switch (action.type) {
    case "SHOW_NOTIF": {
      return { ...state, ...action.payload };
    }
  }
  return state;
};

const NotifContextProvider: React.FC = (props) => {
  let [notif, notifDispatch] = useReducer(reducer, { ...initialState });
  let value = { notif, notifDispatch };

  return (
    <NotifContext.Provider value={value}>
      {props.children}
    </NotifContext.Provider>
  );
};

let NotifContextConsumer = NotifContext.Consumer;
export { NotifContext, NotifContextProvider, NotifContextConsumer };
