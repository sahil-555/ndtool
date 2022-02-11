import React, { createContext, useReducer } from "react";

interface UserType {
  name: string;
  email: string;
  role: string;
  country: string;
  admin: false;
}

const initialState: UserType = {
  name: "",
  email: "",
  role: "",
  country: "",
  admin: false,
};

const UserContext = createContext<{
  user: any;
  userDispatch: React.Dispatch<any>;
}>({ user: { ...initialState }, userDispatch: () => {} });

let reducer = (state: UserType, action: { type: any; payload: any }) => {
  switch (action.type) {
    case "SET_USER": {
      return { ...state, ...action.payload };
    }
  }
  return state;
};

const UserContextProvider: React.FC = (props) => {
  let [user, userDispatch] = useReducer(reducer, { ...initialState });
  let value = { user, userDispatch };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};

let UserContextConsumer = UserContext.Consumer;
export { UserContext, UserContextProvider, UserContextConsumer };
