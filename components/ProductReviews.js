import React, { useEffect, useState } from "react";
import styled from "styled-components";
import WhiteBox from "./WhiteBox";
import Input from "./Input";
import StarsRating from "./StarsRating";
import TextArea from "./TextArea";
import Button from "./Button";
import axios from "axios";
import Spinner from "./Spinner";

const Title = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const SubTitle = styled.h3`
  font-size: 1rem;
  margin-top: 5px;
`;

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 400px;
  }
`;

const ReviewWrapper = styled.div`
  margin-bottom: 10px;
  border-top: 1px solid #eee;
  padding: 10px 0;
  h3 {
    margin: 3px 0;
    font-size: 1rem;
    color: #333;
    font-weight: normal;
  }
  p {
    margin: 0;
    font-size: 0.7rem;
    line-height: 1rem;
    color: #555;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  time {
    font-size: 12px;
    color: #aaa;
  }
`;

const ProductReviews = ({ product }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stars, setStars] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const submitReview = () => {
    const data = {
      title,
      description,
      stars,
      product: product._id,
    };
    axios.post("/api/reviews", data).then((res) => {
      setTitle("");
      setDescription("");
      setStars("");
      loadReviews();
    });
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    setReviewsLoading(true);
    axios.get("/api/reviews?product=" + product._id).then((res) => {
      setReviews(res.data);
      setReviewsLoading(false);
    });
  };
  return (
    <div>
      <Title>Reviews</Title>
      <ColsWrapper>
        <div>
          <WhiteBox>
            <SubTitle>Add a review</SubTitle>
            <div>
              <StarsRating onChange={setStars} />
            </div>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <TextArea
              placeholder="Was it good?"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <div>
              <Button primary onClick={submitReview}>
                Submit review
              </Button>
            </div>
          </WhiteBox>
        </div>
        <div>
          <WhiteBox>
            <SubTitle>All reviews</SubTitle>
            {reviewsLoading && <Spinner fullWidth={true} />}
            {reviews.length === 0 && <p>no reviews :{"("}</p>}
            {reviews.length > 0 &&
              reviews.map((review) => {
                return (
                  <ReviewWrapper>
                    <ReviewHeader>
                      <StarsRating
                        size={"sm"}
                        disabled={true}
                        defaultHowMany={review.stars}
                      />
                      <time>
                        {new Date(review.createdAt).toLocaleString("EN-US")}
                      </time>
                    </ReviewHeader>

                    <h3> {review.title}</h3>
                    {review.description}
                  </ReviewWrapper>
                );
              })}
          </WhiteBox>
        </div>
      </ColsWrapper>
    </div>
  );
};

export default ProductReviews;
