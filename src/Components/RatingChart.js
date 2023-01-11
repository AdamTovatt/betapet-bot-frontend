import * as React from "react";
import styled from "styled-components";
import {
  LineChart,
  Path,
  HintPoint,
  TooltipWrapper,
  TooltipLabel,
  TooltipValue,
  TooltipXAxisValue,
} from "styled-chart";
import { Color } from "./Constants";

// That's how you style the paths for Dogs, Cats, Pets
// You can also adjust the other <path /> rules, such as stroke-dasharray
const StyledPath = styled(Path)`
  && {
    ${({ strokeColor, strokeWidth, fillColor }) => `
      stroke: ${strokeColor} !important;
      stroke-width: ${strokeWidth ? strokeWidth : 2}px;
      fill: ${fillColor ? fillColor : "transparent"};
    `}
  }
`;

// That's how you style the 'colored hint dots' in the tooltip
const StyledHint = styled(HintPoint)`
  && {
    ${({ backgroundColor }) => `
      background-color: ${backgroundColor};
    `}
  }
`;

// That's how you can style the Tooltip
const StyledTooltip = styled(TooltipWrapper)`
  && {
    ${({ backgroundColor, textColor }) => `
      ${backgroundColor ? `background: ${backgroundColor}` : ``};
      ${textColor ? `color: ${textColor}` : ``};
    `}
    ${TooltipLabel} {
      font-style: italic;
    }
    ${TooltipValue} {
      font-style: italic;
    }
    ${TooltipXAxisValue} {
      opacity: 0.8;
    }
    // Let's make a hint tooltip more as a line
    ${StyledHint} {
      && {
        padding-left: 4px;
        padding-right: 4px;
        border-radius: 20px;
        height: 3px;
      }
    }
  }
`;

const CHART_HEIGHT = 300;
const CHART_LINES_FLEXURE = 1;

const X_AXIS = (steps) => {
  return {
    key: "xValue",
    step: steps,
  };
};

const Y_AXIS = (max, min) => {
  return { maxValue: max, minValue: min };
};

const CONFIG = {
  rating: {
    label: "rating",
    isFilled: false,
    component: <StyledPath strokeColor="#3ab997" strokeWidth={2} />,
  },
};

const TOOLTIP = {
  isVisible: true,
  component: <StyledTooltip textColor={Color.White} />,
  hints: {
    rating: <StyledHint backgroundColor="#3ab997" />,
  },
};

const RatingChart = ({ data }) => {
  return (
    <LineChart
      height={CHART_HEIGHT}
      flexure={CHART_LINES_FLEXURE}
      tooltip={TOOLTIP}
      yAxis={Y_AXIS(
        Math.max(...data.map((o) => o.rating)) + 100,
        Math.min(...data.map((o) => o.rating)) - 100
      )}
      xAxis={X_AXIS(data.length / 2)}
      config={CONFIG}
      data={data}
    />
  );
};

export default RatingChart;
