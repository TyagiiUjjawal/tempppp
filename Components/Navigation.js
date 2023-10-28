import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {useAuth} from './AuthContext';

import SignUpScreen from './SignUp';
import SignInScreen from './SignIn';
import ProtectedScreen from './MakePhone';

const AuthNavigator = createStackNavigator({
  SignUp: SignUpScreen,
  SignIn: SignInScreen,
});

const ProtectedNavigator = createStackNavigator({
  Protected: ProtectedScreen,
});

const AppNavigator = createSwitchNavigator(
  {
    Auth: AuthNavigator,
    Protected: ProtectedNavigator,
  },
  {
    initialRouteName: 'Protected',
  },
);
const AppNavigator1 = createSwitchNavigator(
  {
    Auth: AuthNavigator,
    Protected: ProtectedNavigator,
  },
  {
    initialRouteName: 'Auth',
  },
);

const AppContainer = createAppContainer(AppNavigator);
const AppContainer1 = createAppContainer(AppNavigator1);

const Navigation = () => {
  const {userIsAuthenticated} = useAuth();

  // Conditionally render the AppContainer based on userIsAuthenticated
  const renderApp = userIsAuthenticated ? (
    <AppContainer />
  ) : (
    <AppContainer1 /> // Render AuthNavigator directly if the user is not authenticated
  );

  return renderApp;
};

export default Navigation;
