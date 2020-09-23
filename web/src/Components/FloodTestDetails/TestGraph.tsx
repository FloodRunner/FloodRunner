import React, { useState } from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  Text,
  Cell,
} from "recharts";
import { Segment, Header } from "semantic-ui-react";
import moment from "moment";
import _ from "lodash";

import { useFloodRunner } from "../../Contexts/floodrunner-context";
import { FloodTestResultSummary } from "../../Models/Api/FloodTest";
import TestStatus from "./TestStatus";

interface TestGraphProps {
  summaries: FloodTestResultSummary[];
}

interface Data {
  date: string;
  value: string;
  isSuccessful: boolean;
  appLogUri: string;
  screenshotUris: string[];
}

const TestGraph: React.FC<TestGraphProps> = ({ summaries }) => {
  const { getTestLogs, setTestLogs, setScreenshotUris } = useFloodRunner();

  const [highlightedIndex, setHighlightedIndex] = useState<Number>(0);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);

  const onBarClick = async (data, index: number) => {
    var payload: Data = data.payload;
    setHighlightedIndex(index);
    if (payload.appLogUri) setTestLogs(await getTestLogs(payload.appLogUri));
    else setTestLogs("No data");

    if (payload.screenshotUris) setScreenshotUris(payload.screenshotUris);
  };

  const onChartAnimationEnd = (data: Data, index: number) => {
    if (isInitialRender) {
      onBarClick({ payload: data }, index);
      setIsInitialRender(false);
    }
  };

  const renderTooltip = ({ payload, label, active }) => {
    const toolTipDataPayload: any = _.first(payload);
    if (!toolTipDataPayload) return;

    const toolTipData: Data = toolTipDataPayload.payload;

    if (active) {
      return (
        <Segment className="customTooltip">
          <Header>
            <Header.Subheader>Time: {toolTipData.date}</Header.Subheader>
            <Header.Subheader>
              Status: <TestStatus isPassing={toolTipData.isSuccessful} />
            </Header.Subheader>
            <Header.Subheader>
              Execution Time (s): {toolTipData.value}
            </Header.Subheader>
          </Header>
        </Segment>
      );
    }

    return null;
  };

  const calculateBarFillColor = (
    index: number,
    isSuccessful?: boolean
  ): string => {
    const highlightedColor = "#03045E"; //take these to a file -> colors.ts
    const successfulColor = "#0096C7";
    const failureColor = "#ff6938";
    const incompleteColor = "#E0E1E2";

    const color =
      index == highlightedIndex
        ? highlightedColor
        : isSuccessful === null
        ? incompleteColor
        : isSuccessful
        ? successfulColor
        : failureColor;
    return color;
  };

  const mapData = (summaries: FloodTestResultSummary[]): Data[] => {
    //transform summaries
    var data: Data[] = summaries.map((summary) => {
      return {
        date: moment(summary.runOn.toString()).format("HH:mm"),
        value: summary.executionTimeInSeconds?.toString() ?? "0",
        isSuccessful: summary.isSuccessful,
        appLogUri: _.find(summary.logFileUris, function (f) {
          return f.includes("app.log");
        }),
        screenshotUris: summary.screenShotUris,
      };
    });

    //reverse data because the latest results would be first (as returned by api)
    data = _.reverse(data);

    return data;
  };

  const data = mapData(summaries);

  return (
    <ResponsiveContainer width="95%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" angle={-45} textAnchor="end" height={40} />
        <YAxis
          label={{
            content: (
              <Text x={0} y={0} dx={20} dy={225} angle={-90}>
                Execution Time (sec)
              </Text>
            ),
          }}
        />
        <Tooltip content={renderTooltip} />
        <Bar
          dataKey="value"
          fill="#0096C7"
          onClick={onBarClick}
          onAnimationEnd={() => onChartAnimationEnd(_.first(data), 0)}
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <Cell
              fill={calculateBarFillColor(index, entry.isSuccessful)}
              key={index}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TestGraph;
