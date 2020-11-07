import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Button,
  MenuItemProps,
  Image,
  Dropdown,
  Header,
  DropdownItemProps,
  Icon,
} from "semantic-ui-react";
import { useAuth0 } from "../../../Contexts/auth0-context";
import "./navbar-styles.css";
import logoSrc from "../../../images/logo.png";

interface NavBarState {
  activeItem: string;
}

interface UserInfo {
  picture: string;
  name: string;
  email: string;
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
  const [userInfo, setUserInfo] = useState<UserInfo>(null);

  useEffect(() => {
    if (!isLoading) {
      const { name, picture, email } = user;
      setUserInfo({
        name,
        picture,
        email,
      });
    }
  }, [isLoading]);

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement | MouseEvent>,
    data: MenuItemProps
  ) => setActiveItem(data.name as string);

  const handleSettingsItemClick = (
    e: React.MouseEvent<HTMLDivElement | MouseEvent>,
    data: DropdownItemProps
  ) => setActiveItem(data.text as string);

  const currentRoute = useLocation().pathname;
  const isLegalRoute = currentRoute.includes("legal");

  const renderLogoutButton = () => {
    return (
      <Button onClick={() => logout({ returnTo: window.location.origin })}>
        Logout
      </Button>
    );
  };

  const renderProfileLabel = () => {
    return (
      <Header dividing as="h3">
        <Image circular src={userInfo.picture} /> {userInfo.name}
        <Header.Subheader>{userInfo.email}</Header.Subheader>
      </Header>
    );
  };

  const renderSettingsDropdown = () => {
    if (!isLoading && user && userInfo) {
      return (
        <Dropdown text="Settings">
          <Dropdown.Menu>
            <Dropdown.Header content={renderProfileLabel()} />
            <Dropdown.Item
              name="profile"
              as={Link}
              to="/settings/profile"
              onClick={handleSettingsItemClick}
            >
              <Icon name="user" /> Profile
            </Dropdown.Item>
            <Dropdown.Item
              name="tokens"
              as={Link}
              to="/settings/tokens"
              onClick={handleSettingsItemClick}
            >
              <Icon name="key" />
              Personal access tokens
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>{renderLogoutButton()}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    }
  };

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
              {renderSettingsDropdown()}
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      )}
    </div>
  );
}

export default NavBar;
