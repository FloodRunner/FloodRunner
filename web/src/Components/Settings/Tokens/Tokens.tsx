import React, { useEffect, useState } from "react";
import { Button, Icon, Table } from "semantic-ui-react";
import _ from "lodash";
import { useAuth0 } from "../../../Contexts/auth0-context";
import { useFloodRunner } from "../../../Contexts/floodrunner-context";
import { AccessToken } from "../../../Models/Api/FloodTest";
import LoadingPlaceholder from "../../Shared/Loader/LoadingPlaceholder";
import history from "../../../Utils/history";
import "./tokens-style.css";
import TokenCreateForm from "./TokenCreateForm";

function Tokens() {
  const { isLoading } = useAuth0();
  const { getAllTokens, deleteTokenById } = useFloodRunner();
  const [accessTokens, setAccessTokens] = useState<AccessToken[]>([]);
  const [showCreateTokenModal, setShowCreateTokenModal] = useState<boolean>(
    false
  );

  useEffect(() => {
    async function test() {
      let floodTests = await getAllTokens();
      setAccessTokens(floodTests);
    }
    if (!isLoading) test();
  }, [isLoading]);

  const renderCreateTokenButton = () => {
    return (
      <Button
        floated="left"
        primary
        className="addTokenBtn"
        onClick={() => setShowCreateTokenModal(true)}
      >
        <Icon name="add" />
        Create Token
      </Button>
    );
  };

  const renderCreateTokenModal = () => {
    if (showCreateTokenModal) {
      return (
        <TokenCreateForm closeModal={() => setShowCreateTokenModal(false)} />
      );
    }
  };

  const renderDeleteTokenButton = (tokenId: string) => {
    return (
      <Button
        compact
        basic
        color="red"
        className="deleteTokenBtn"
        onClick={async () => {
          await deleteTokenById(tokenId);
          history.go(0);
        }}
      >
        <Icon name="trash" />
      </Button>
    );
  };

  const renderTokens = (accessTokens: AccessToken[]) => {
    return (
      <Table basic="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Token name</Table.HeaderCell>
            <Table.HeaderCell>Token description</Table.HeaderCell>
            <Table.HeaderCell>Expires on</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {accessTokens.map((accessToken) => {
            return (
              <Table.Row key={accessToken._id}>
                <Table.Cell>{accessToken.name}</Table.Cell>
                <Table.Cell>{accessToken.description}</Table.Cell>
                <Table.Cell>{accessToken.expiresAt}</Table.Cell>
                <Table.Cell>
                  {renderDeleteTokenButton(accessToken._id)}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  };

  return (
    <>
      <div>
        <h3>Personal Access Tokens</h3>
        <p>
          These can be used instead of a password for applications like Git or
          can be passed in the `x-api-key` header to access REST APIs
        </p>
      </div>
      {isLoading ? (
        <LoadingPlaceholder />
      ) : (
        <>
          {renderCreateTokenButton()}
          {renderTokens(accessTokens)}
        </>
      )}
      {renderCreateTokenModal()}
    </>
  );
}

export default Tokens;
