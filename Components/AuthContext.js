import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({children}) => {
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserIsAuthenticated(true);
        } else {
          setUserIsAuthenticated(false);
        }
      } catch (error) {
        // Handle errors
        console.log('Error:', error);
      }
    };

    checkUserAuthentication();
  }, []);

  //   const signIn = () => {
  //     // Perform the sign-in logic here
  //     // Update the userIsAuthenticated state accordingly
  //   };

  //   const signOut = () => {
  //     // Perform the sign-out logic here
  //     // Update the userIsAuthenticated state accordingly
  //   };

  return (
    <AuthContext.Provider value={{userIsAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
};
