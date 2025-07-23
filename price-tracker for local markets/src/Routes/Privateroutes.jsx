import React, { use } from 'react';
import { AuthContext } from '../context/AuthContext';
import Loader from '../Pages/Loader';
import { Navigate } from 'react-router';

const Privateroutes = ({children}) => {
    const {user,loading} = use(AuthContext);
    if(loading){
        return <Loader/>
    }
    if (user && user?.email) {
    return children;
  }
    return  <Navigate to="/login"></Navigate>
};

export default Privateroutes;