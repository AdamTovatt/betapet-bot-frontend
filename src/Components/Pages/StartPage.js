import styled from "styled-components";
import { Color } from "../Constants";
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
    <>
      <VerticalSpacing></VerticalSpacing>
      <CenterContainer>
        {ratingInfo ? (
          <RatingChartContainer>
            Current rating: {ratingInfo[ratingInfo.length - 1].rating}
            <RatingChart data={ratingInfo}></RatingChart>
          </RatingChartContainer>
        ) : null}
      </CenterContainer>
    </>
  );
};

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

const VerticalSpacing = styled.div`
  min-height: 2rem;
`;

const RatingChartContainer = styled.div`
  max-width: 80vw;
  max-height: 10rem;
  width: 30rem;
`;

export default StartPage;
