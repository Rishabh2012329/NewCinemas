import axios from 'axios';
import React, { createContext, useReducer, useEffect } from 'react';

const initialState = {
  genres:[{name:"action",id:2}],
  theme:"dark",
  cached:{},
  page:0,
  modal:{visible:false,id:""}
};
  const movieContext = createContext(initialState);
  const { Provider } = movieContext;
  
  const MovieProvider = ({ children }) => {
    

    const [state, dispatch] = useReducer((state, action) => {
      switch (action.type) {
        case "SET":
          return { ...state, ...action.payload };
        case "ADD_MOVIES":
          return {...state,movies:[...state.movies,...action.payload.movies],page:state.page+1}
        default:
          return state;
      }
    }, initialState);
  
    return <Provider value={{ state, dispatch }}>{children}</Provider>;
  };
  
  export { movieContext, MovieProvider };