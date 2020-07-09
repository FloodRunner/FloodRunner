import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Button, MenuItemProps, Image } from "semantic-ui-react";
import { useAuth0 } from "../../../Contexts/auth0-context";
import "./navbar-styles.css";
import logoSrc from "../../../images/logo.png";

interface NavBarState {
  activeItem: string;
}

function NavBar() {
  const {
    isLoading,
    user,
    loginWithRedirect,
    logout,
    isAuthenticated,
  } = useAuth0();
  const [activeItem, setActiveItem] = useState("overview");

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement | MouseEvent>,
    data: MenuItemProps
  ) => setActiveItem(data.name as string);

  const currentRoute = useLocation().pathname;
  const isLegalRoute = currentRoute.includes("legal");
  return (
    <div className="floodrunner-menu-container">
      {isLegalRoute ? (
        <Image
          href="/"
          className="floodrunner-navbar"
          src={logoSrc}
          size="small"
        />
      ) : (
        <Image
          href="/"
          className="floodrunner-navbar"
          floated="left"
          src={logoSrc}
          size="small"
        />
      )}

      {isLegalRoute ? (
        ""
      ) : (
        <Menu className="floodrunner-menu" pointing secondary>
          {isAuthenticated && (
            <Menu.Item
              name="overview"
              active={activeItem === "overview"}
              onClick={handleItemClick}
              as={Link}
              to="/"
            >
              Overview
            </Menu.Item>
          )}
          <Menu.Menu position="right">
            <Menu.Item>
              {!isLoading && !user && (
                <Button onClick={loginWithRedirect}>Login</Button>
              )}
              {!isLoading && user && (
                <Button
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  Logout
                </Button>
              )}
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      )}
    </div>
  );
}

export default NavBar;
