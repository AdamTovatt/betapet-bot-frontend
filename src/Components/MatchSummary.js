import styled from "styled-components";
import { GetTimeSinceDate } from "../Functions";
import { BorderRadius, Color } from "./Constants";
import VerticalSpacing from "./VerticalSpacing";

const MatchSummary = ({ match }) => {
  return (
    <SummaryBackground
      borderColor={match.ratingChange > 0 ? Color.Green : Color.Red}
    >
      <SummaryContent>
        <SummaryColumn>
          <SummaryRow align={"left"}>{match.ratingChange} rating</SummaryRow>
          <SummaryRow align={"left"}>{match.completion}% completion</SummaryRow>
          <VerticalSpacing height={1} />
          <SummaryRow align={"left"}>
            <ScorePill
              width={10}
              ourScore={match.ourScore}
              theirScore={match.theirScore}
            />
          </SummaryRow>
        </SummaryColumn>
        <SummaryColumn>
          <SummaryRow align={"right"}>
            {match.ourTurn ? "waiting for us" : "waiting for opponent"}
          </SummaryRow>
          <SummaryRow align={"right"}>
            {match.opponent.name + " (" + match.opponent.rating + ")"}
          </SummaryRow>
          <VerticalSpacing height={1} />
          <SummaryRow align={"right"}>
            {GetTimeSinceDate(match.lastPlayTime)}
          </SummaryRow>
        </SummaryColumn>
      </SummaryContent>
    </SummaryBackground>
  );
};

const ScorePill = ({ width, ourScore, theirScore }) => {
  let ourWidth = (ourScore / (ourScore + theirScore)) * width;
  let theirWidth = (theirScore / (ourScore + theirScore)) * width;
  return (
    <ScorePillBackground width={width}>
      <OurScore width={ourWidth} bothRound={theirWidth === 0}>
        {ourScore}
      </OurScore>
      <TheirScore width={theirWidth} bothRound={ourScore === 0}>
        {theirScore}
      </TheirScore>
    </ScorePillBackground>
  );
};

const ScorePillBackground = styled.div`
  display: flex;
  width: ${(props) => props.width + "rem"};
`;

const OurScore = styled.div`
  text-align: center;
  min-height: 2rem;
  background-color: ${Color.Green};
  width: ${(props) => props.width + "rem"};
  border-radius: ${BorderRadius.Default}
    ${(props) => (props.bothRound ? BorderRadius.Default : 0)}
    ${(props) => (props.bothRound ? BorderRadius.Default : 0)}
    ${BorderRadius.Default};
  color: ${Color.DarkLightest};
  font-family: "Jost";
  font-weight: 500;
`;

const TheirScore = styled.div`
  text-align: center;
  min-height: 2rem;
  background-color: ${Color.Red};
  width: ${(props) => props.width + "rem"};
  border-radius: ${(props) => (props.bothRound ? BorderRadius.Default : 0)}
    ${BorderRadius.Default} ${BorderRadius.Default}
    ${(props) => (props.bothRound ? BorderRadius.Default : 0)};
  color: ${Color.DarkLightest};
  font-family: "Jost";
  font-weight: 500;
`;

const SummaryRow = styled.div`
  text-align: ${(props) => props.align};
`;

const SummaryColumn = styled.div``;

const SummaryContent = styled.div`
  width: auto;
  height: auto;
  padding: 1.3rem;
  padding-top: 1.1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SummaryBackground = styled.div`
  background-color: ${Color.DarkLightest};
  width: 100%;
  min-height: 4rem;
  border-radius: ${BorderRadius.Default};
  border: 1px solid ${(props) => props.borderColor};

  -webkit-box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.2);
  box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.2);
`;

export default MatchSummary;