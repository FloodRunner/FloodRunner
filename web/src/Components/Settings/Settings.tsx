import React, { useEffect, useState } from "react";
import { Link, Switch } from "react-router-dom";
import { Menu, MenuItemProps, Grid, Segment, Icon } from "semantic-ui-react";
import ProtectedRoute from "../../Routes/ProtectedRoute";
import Profile from "./Profile/Profile";
import Tokens from "./Tokens/Tokens";

function SettingsMenu(props) {
  const { section } = props.match.params;
  const [activeItem, setActiveItem] = useState<string>(null);

  useEffect(() => {
    setActiveItem(section);
  }, []);

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement | MouseEvent>,
    data: MenuItemProps
  ) => setActiveItem(data.name as string);

  return (
    <Grid padded>
      <Grid.Column width={4}>
        <Menu vertical pointing secondary size="massive">
          <Menu.Item>
            <Menu.Header>Account</Menu.Header>
            <Menu.Menu>
              <Menu.Item
                name="profile"
                as={Link}
                to="/settings/profile"
                active={activeItem === "profile"}
                onClick={handleItemClick}
              >
                <div>
                  <Icon name="user" /> Profile
                </div>
              </Menu.Item>
            </Menu.Menu>

            <Menu.Header>Security</Menu.Header>
            <Menu.Menu>
              <Menu.Item
                name="tokens"
                as={Link}
                to="/settings/tokens"
                active={activeItem === "tokens"}
                onClick={handleItemClick}
              >
                <div>
                  <Icon name="key" /> Personal access tokens
                </div>
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>
        </Menu>
      </Grid.Column>
      <Grid.Column width={12}>
        <Segment basic>
          <Switch>
            <ProtectedRoute path="/settings/tokens" component={Tokens} />
            <ProtectedRoute path="/settings/profile" component={Profile} />
          </Switch>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}

export default SettingsMenu;
