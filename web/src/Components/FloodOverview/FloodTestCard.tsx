import React, { useEffect, useState, FunctionComponent } from "react";
import { Button, Icon, Card, Item, Container, Label } from "semantic-ui-react";
import moment from "moment";
import { FloodTest } from "../../Models/Api/FloodTest";
import { Link } from "react-router-dom";

const FloodTestCard = (floodTest?: FloodTest) => {
  const renderLabel = (isPassing?: boolean): JSX.Element => {
    return (
      <Label color={isPassing === null ? "grey" : isPassing ? "green" : "red"}>
        {isPassing === null ? "Incomplete" : isPassing ? "Passing" : "Failing"}
      </Label>
    );
  };

  const renderInterval = (interval?: number): JSX.Element => {
    return (
      <Label color="pink">
        <Icon name="repeat" />
        {interval} min
      </Label>
    );
  };

  const renderLastTimeRan = (lastTimeRan?: string): JSX.Element => {
    return (
      <Label color="pink">
        <Icon name="clock" />
        {moment(lastTimeRan).format("HH:mm DD/MM/YYYY")}
      </Label>
    );
  };

  return (
    <Card fluid>
      <Card.Content>
        <Item>
          <Item.Content>
            <Item.Header as="h3">{floodTest.name}</Item.Header>
            <Item.Meta>
              <span>{floodTest.description}</span>
            </Item.Meta>

            <Item.Extra className="label">
              {renderLabel(floodTest.resultOverview.isPassing)}
              {renderInterval(floodTest.interval)}
              {renderLastTimeRan(floodTest.resultOverview?.lastRun?.toString())}
              <Link to={`/tests/${floodTest._id}`} className="header">
                <Button primary animated floated="right">
                  <Button.Content visible>View Results</Button.Content>
                  <Button.Content hidden>
                    <Icon name="arrow right" />
                  </Button.Content>
                </Button>
              </Link>
            </Item.Extra>
          </Item.Content>
        </Item>
      </Card.Content>
    </Card>
  );
};

export default FloodTestCard;
