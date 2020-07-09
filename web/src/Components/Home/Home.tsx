import React, { useState } from "react";
import { MenuItemProps } from "semantic-ui-react";
import { useAuth0 } from "../../Contexts/auth0-context";

interface NavBarState {
  activeItem: string;
}

function Home() {
  const {
    isLoading,
    user,
    loginWithRedirect,
    logout,
    isAuthenticated,
  } = useAuth0();
  const [activeItem, setActiveItem] = useState("home");

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement | MouseEvent>,
    data: MenuItemProps
  ) => setActiveItem(data.name as string);

  return <div>Home Component</div>;
}

export default Home;
