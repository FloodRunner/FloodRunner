import React, { useEffect, Component } from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { useAuth0 } from "../Contexts/auth0-context";

interface IProtectedRouteOptions {
  component: React.FC;
  path: string;
  exact?: boolean;
}

type ProtectedRouteOptions = IProtectedRouteOptions;

const ProtectedRoute = ({
  component,
  path,
  exact,
  ...rest
}: ProtectedRouteOptions) => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fn = async () => {
      if (isLoading || !loginWithRedirect) return;

      if (!isAuthenticated) {
        await loginWithRedirect({
          redirect_uri: "",
          appState: { targetUrl: path },
        });
      }
    };

    fn();
  }, [isAuthenticated, loginWithRedirect, path]);

  const render = (props: RouteComponentProps<{}>) => <Component {...props} />;

  return (
    <Route
      path={path}
      render={render}
      exact={exact}
      component={component}
      {...rest}
    />
  );
};

export default ProtectedRoute;
