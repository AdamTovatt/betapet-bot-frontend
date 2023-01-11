import styled from "styled-components";
import { BorderRadius, Color } from "../Constants";
import { useState, useEffect } from "react";
import { GetRating } from "../../Api";
import RatingChart from "../RatingChart";

const StartPage = () => {
  const [ratingInfo, setRatingInfo] = useState(null);
  const [hasFetchedRatingInfo, setHasFetchedRatingInfo] = useState(false);
  const [fetchingRatingInfo, setFetchingRatingInfo] = useState(false);

  useEffect(() => {
    async function FetchRatingInfo() {
      setFetchingRatingInfo(true);
      let response = await GetRating(false); //false: don't include hidden courses
      setFetchingRatingInfo(false);
      if (response.status === 200) {
        let json = await response.json();
        console.log(json);
        setRatingInfo(json);
      }
      setHasFetchedRatingInfo(true);
    }

    if (!hasFetchedRatingInfo) {
      FetchRatingInfo();
    }
  }, [ratingInfo, hasFetchedRatingInfo, fetchingRatingInfo]);

  return (
    <Page>
      <VerticalSpacing />
      <CenterContainer>
        {ratingInfo ? (
          <>
            <RatingChartContainer>
              <RatingChart data={ratingInfo} height={"20rem"}></RatingChart>
            </RatingChartContainer>
            <UserStatsPanel>
              <StatRow>
                <StatColumn>Current rating:</StatColumn>
                <StatColumn>
                  {ratingInfo[ratingInfo.length - 1].rating}
                </StatColumn>
              </StatRow>
              <VerticalSpacing height={0.4} />
              <StatRow>
                <StatColumn>Active matches:</StatColumn>
                <StatColumn>{24}</StatColumn>
              </StatRow>
            </UserStatsPanel>
          </>
        ) : null}
      </CenterContainer>
    </Page>
  );
};

const Page = styled.div`
  background-color: ${Color.Dark};
  width: 100vw;
  height: 100vh;
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

const StatColumn = styled.div``;

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
  min-height: ${(props) => (props ? props.height + "rem" : "2rem")};
`;

const RatingChartContainer = styled.div`
  max-width: 80vw;
  width: 30rem;
  background-color: ${Color.DarkLighter};
  padding: 2rem;
  padding-right: 2.2.rem;
  padding-bottom: 1rem;
  border-radius: ${BorderRadius.Default};
  margin: 1rem;

  -webkit-box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.2);
  box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.2);
`;

export default StartPage;
