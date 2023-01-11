import styled from "styled-components";
import { BorderRadius, Color } from "../Constants";
import { useState, useEffect } from "react";
import { GetRating, GetStatus } from "../../Api";
import RatingChart from "../RatingChart";
import { BarLoader } from "react-spinners";

const StartPage = () => {
  const [ratingInfo, setRatingInfo] = useState(null);
  const [hasFetchedRatingInfo, setHasFetchedRatingInfo] = useState(false);
  const [fetchingRatingInfo, setFetchingRatingInfo] = useState(false);
  const [status, setStatus] = useState(null);
  const [hasFetchedStatus, setHasFetchedStatus] = useState(false);
  const [fetchingStatus, setFetchinsStatus] = useState(false);
  const [counter, setCounter] = useState(0);

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
      <VerticalSpacing height={1} />
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
              <StatColumn>
                {GetLastPlayTimeText(status.lastPlayTime)}
              </StatColumn>
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
                {(100 * status.leading) / status.activeMatches + "%"}
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
                {(100 * status.leadingRatingCorrected) / status.activeMatches +
                  "%"}
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
      </CenterContainer>
    </Page>
  );
};

function GetLastPlayTimeText(lastPlayTime) {
  let seconds = (Date.now() - new Date(lastPlayTime)) / 1000;
  let minutes = seconds / 60;
  let hours = minutes / 60;
  if (minutes < 2) {
    return seconds.toString().split(".")[0] + " s";
  } else if (hours < 2) {
    return minutes.toString().split(".")[0] + " min";
  } else if (hours < 24) {
    return hours.toString().split(".")[0] + " h";
  } else {
    return lastPlayTime.toString().replace("T", " ");
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
  width: 30rem;
  border-radius: ${BorderRadius.Default};
  padding: 2rem;

  -webkit-box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.2);
  box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.2);
`;

const VerticalSpacing = styled.div`
  min-height: ${(props) => (props.height ? props.height + "rem" : "2rem")};
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
