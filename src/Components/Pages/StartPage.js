import styled from "styled-components";
import { BorderRadius, Color } from "../Constants";
import { useState, useEffect } from "react";
import { GetRating, GetStatus, GetChatResponse, GetMatches } from "../../Api";
import RatingChart from "../RatingChart";
import { BarLoader } from "react-spinners";
import TextField from "../Input/TextField";
import MatchSummary from "../MatchSummary";
import VerticalSpacing from "../VerticalSpacing";
import { GetTimeSinceDate } from "../../Functions";

const StartPage = () => {
  const [ratingInfo, setRatingInfo] = useState(null);
  const [hasFetchedRatingInfo, setHasFetchedRatingInfo] = useState(false);
  const [fetchingRatingInfo, setFetchingRatingInfo] = useState(false);
  const [status, setStatus] = useState(null);
  const [hasFetchedStatus, setHasFetchedStatus] = useState(false);
  const [fetchingStatus, setFetchinsStatus] = useState(false);
  const [counter, setCounter] = useState(0);
  const [botChatAnswer, setBotChatAnswer] = useState(null);
  const [matches, setMatches] = useState(null);
  const [hasFetchedMatches, setHasFetchedMatches] = useState(false);
  const [isFetchingMatches, setIsFetchingMatches] = useState(false);

  useEffect(() => {
    async function FetchRatingInfo() {
      setFetchingRatingInfo(true);
      let response = await GetRating();
      setFetchingRatingInfo(false);
      if (response.status === 200) {
        let json = await response.json();
        console.log(json);
        setRatingInfo(json);
      }
      setHasFetchedRatingInfo(true);
    }

    async function FetchStatus() {
      setFetchinsStatus(true);
      let response = await GetStatus();
      setFetchinsStatus(false);
      if (response.status === 200) {
        let json = await response.json();
        console.log(json);
        setStatus(json);
      }
      setHasFetchedStatus(true);
      setIsFetchingMatches(false);
    }

    async function FetchMatches() {
      let response = await GetMatches();
      if (response.status === 200) {
        let json = await response.json();
        console.log(json);
        setMatches(json);
      }
      setHasFetchedMatches(true);
    }

    if (!hasFetchedMatches && !isFetchingMatches) {
      FetchMatches();
      setIsFetchingMatches(true);
    }

    if (!hasFetchedRatingInfo && !fetchingRatingInfo) {
      FetchRatingInfo();
    }

    if (!hasFetchedStatus && !fetchingStatus) {
      FetchStatus();
    }

    const interval = setInterval(() => {
      setCounter(counter + 1);

      if (counter !== 0 && counter % 60 === 0) {
        FetchStatus();
      }
      if (counter !== 0 && counter % 300 === 0) {
        FetchRatingInfo();
        FetchMatches();
        setCounter(0);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [
    ratingInfo,
    hasFetchedRatingInfo,
    fetchingRatingInfo,
    status,
    fetchingStatus,
    hasFetchedStatus,
    counter,
  ]);

  return (
    <Page>
      <VerticalSpacing height={0.6} />
      <CenterContainer>
        {ratingInfo ? (
          <>
            <RatingChartContainer>
              <RatingChart data={ratingInfo} height={"20rem"}></RatingChart>
            </RatingChartContainer>
          </>
        ) : (
          <LoaderPanel>
            <Loader />
          </LoaderPanel>
        )}
        <VerticalSpacing height={1} />

        {status ? (
          <UserStatsPanel>
            <StatRow>
              <StatColumn>Last play time:</StatColumn>
              <StatColumn>{GetTimeSinceDate(status.lastPlayTime)}</StatColumn>
            </StatRow>
            <VerticalSpacing height={0.4} />
            <StatRow>
              <StatColumn>Current rating:</StatColumn>
              <StatColumn>{status.rating}</StatColumn>
            </StatRow>
            <VerticalSpacing height={0.4} />
            <StatRow>
              <StatColumn>Projected rating change:</StatColumn>
              <StatColumn
                color={
                  status.projectedRatingChange > 0 ? Color.Green : Color.Red
                }
              >
                {status.projectedRatingChange > 0
                  ? "+" + status.projectedRatingChange
                  : status.projectedRatingChange}
              </StatColumn>
            </StatRow>
            <VerticalSpacing height={0.4} />
            <StatRow>
              <StatColumn>Leading:</StatColumn>
              <StatColumn
                color={
                  status.leading > status.activeMatches / 2
                    ? Color.Green
                    : Color.Red
                }
              >
                {Math.round((100 * status.leading) / status.activeMatches) +
                  "%"}
              </StatColumn>
            </StatRow>
            <VerticalSpacing height={0.4} />
            <StatRow>
              <StatColumn>Leading (rating corrected):</StatColumn>
              <StatColumn
                color={
                  status.leadingRatingCorrected > status.activeMatches / 2
                    ? Color.Green
                    : Color.Red
                }
              >
                {Math.round(
                  (100 * status.leadingRatingCorrected) / status.activeMatches
                ) + "%"}
              </StatColumn>
            </StatRow>
          </UserStatsPanel>
        ) : (
          <LoaderPanel>
            <Loader />
          </LoaderPanel>
        )}
        <VerticalSpacing height={1} />
        {status ? (
          <UserStatsPanel>
            <StatRow>
              <StatColumn>Active matches:</StatColumn>
              <StatColumn>{status.activeMatches}</StatColumn>
            </StatRow>
            <VerticalSpacing height={0.4} />
            <StatRow>
              <StatColumn>Opponents waiting for us:</StatColumn>
              <StatColumn>{status.opponentsWaitingForUs}</StatColumn>
            </StatRow>
            <VerticalSpacing height={0.4} />
            <StatRow>
              <StatColumn>Matches won:</StatColumn>
              <StatColumn>{status.won}</StatColumn>
            </StatRow>
            <VerticalSpacing height={0.4} />
            <StatRow>
              <StatColumn>Matches lost:</StatColumn>
              <StatColumn>{status.lost}</StatColumn>
            </StatRow>
            <VerticalSpacing height={0.4} />
            <StatRow>
              <StatColumn>Total matches:</StatColumn>
              <StatColumn>{status.won + status.lost}</StatColumn>
            </StatRow>
            <VerticalSpacing height={0.4} />
            <StatRow>
              <StatColumn>Bingos:</StatColumn>
              <StatColumn>{status.bingos}</StatColumn>
            </StatRow>
            <VerticalSpacing height={0.4} />
            <StatRow>
              <StatColumn>Average time per move:</StatColumn>
              <StatColumn>
                {status.averageTimePerMove
                  ? status.averageTimePerMove / 1000 + " s"
                  : "?"}
              </StatColumn>
            </StatRow>
          </UserStatsPanel>
        ) : (
          <LoaderPanel>
            <Loader />
          </LoaderPanel>
        )}
        <VerticalSpacing height={1} />
        <TextField
          onSumbit={(text) => {
            GetApiResponseOnChat(text, setBotChatAnswer);
          }}
          color={Color.DarkLighter}
          placeHolder={"Write a message to test the response..."}
          title={"Test the chat function"}
        ></TextField>
        <VerticalSpacing height={1} />
        {botChatAnswer ? (
          <>
            <UserStatsPanel>
              <StatRow>
                <StatColumn>{botChatAnswer}</StatColumn>
              </StatRow>
            </UserStatsPanel>
            <VerticalSpacing height={1} />
          </>
        ) : null}
        <VerticalSpacing height={1} />
        <UserPanelTitle>Matches</UserPanelTitle>
        {matches ? (
          <UserStatsPanel padding={2}>
            {matches.map((match) => (
              <>
                <MatchSummary match={match} />
                <VerticalSpacing height={0.8} />
              </>
            ))}
          </UserStatsPanel>
        ) : (
          <LoaderPanel>
            <Loader />
          </LoaderPanel>
        )}
        <VerticalSpacing height={2} />
      </CenterContainer>
    </Page>
  );
};

async function GetApiResponseOnChat(message, setMessage) {
  let result = await GetChatResponse(message);

  if (result.status === 200) {
    let json = await result.json();
    setMessage(json.message);
  }
}

const Loader = () => {
  return (
    <BarLoader
      color={Color.Purple}
      height={17}
      speedMultiplier={1.2}
      width={400}
    />
  );
};

const LoaderPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${Color.DarkLighter};
  max-width: 80vw;
  width: 30rem;
  border-radius: ${BorderRadius.Default};
  padding: 2rem;

  -webkit-box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.2);
  box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.2);
`;

const Page = styled.div`
  background-color: ${Color.Dark};
  width: 100%;
  height: 100%;
`;

const UserPanelTitle = styled.div`
  margin-bottom: 0.4rem;
  text-align: center;
  width: 100%;
`;

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  flex-direction: column;
  color: ${Color.White};
  font-family: "Jost";
  font-size: 1.2rem;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StatColumn = styled.div`
  color: ${(props) =>
    props ? (props.color ? props.color : Color.White) : Color.White};
`;

const UserStatsPanel = styled.div`
  background-color: ${Color.DarkLighter};
  max-width: 80vw;
  width: ${(props) => (props.width ? props.width + "rem" : "30rem")};
  border-radius: ${BorderRadius.Default};
  padding: ${(props) => (props.padding ? props.padding + "rem" : "2rem")};

  -webkit-box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.2);
  box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.2);
`;

const RatingChartContainer = styled.div`
  max-width: 80vw;
  width: 30rem;
  background-color: ${Color.DarkLighter};
  padding: 2rem;
  padding-right: 2.2.rem;
  padding-bottom: 1rem;
  border-radius: ${BorderRadius.Default};

  -webkit-box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.2);
  box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.2);
`;

export default StartPage;
