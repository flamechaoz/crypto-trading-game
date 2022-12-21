import React from 'react';
import { IUser } from '../api/types';

interface State {
  authUser: IUser | null;
}

interface Action {
  type: string;
  payload: IUser | null;
}

type Dispatch = (action: Action) => void;

const initialState: State = {
  authUser: null,
};

interface StateContextProviderProps {
  children: React.ReactNode;
}

const StateContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_USER': {
      return {
        ...state,
        authUser: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
};

const StateContextProvider: React.FC<StateContextProviderProps> = ({ children }: StateContextProviderProps) => {
  const [state, dispatch] = React.useReducer(stateReducer, initialState);
  const value = { state, dispatch };
  return <StateContext.Provider value={value}> {children} </StateContext.Provider>;
};

const useStateContext = (): { state: State; dispatch: Dispatch } | undefined => {
  const context = React.useContext(StateContext);

  if (context != null) {
    return context;
  }

  throw new Error(`useStateContext must be used within a StateContextProvider`);
};

export { StateContextProvider, useStateContext };
