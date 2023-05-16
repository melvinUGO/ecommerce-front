import React, { useState } from "react";
import StarOutline from "./icons/StarOutline";
import styled from "styled-components";
import StarSolid from "./icons/StarSolid";
import { primary } from "@/lib/colors";

const StarsWrapper = styled.div`
  display: flex;
  gap: 1px;
  align-items: center;
`;

const StarWrapper = styled.button`
  ${(props) =>
    props.size === "md" &&
    `
height: 1.4rem;
  width: 1.4rem;
`}
  ${(props) =>
    props.size === "sm" &&
    `
height: 1rem;
  width: 1rem;
`}
${(props) => !props.disabled && " cursor: pointer;"}

  padding: 0;
  border: 0;
  display: inline-block;
  background-color: transparent;
  color: ${primary};
`;

const StarsRating = ({
  size = "md",
  defaultHowMany = 0,
  onChange,
  disabled,
}) => {
  const [howMany, setHowMany] = useState(defaultHowMany);
  const five = [1, 2, 3, 4, 5];

  function handleStarClick(n) {
    if (disabled) return;
    setHowMany(n);
    onChange(n);
  }
  return (
    <StarsWrapper>
      {five.map((n) => {
        return (
          <>
            <StarWrapper
              disabled={disabled}
              size={size}
              onClick={() => handleStarClick(n)}
            >
              {howMany >= n ? <StarSolid /> : <StarOutline />}
            </StarWrapper>
          </>
        );
      })}
    </StarsWrapper>
  );
};

export default StarsRating;
