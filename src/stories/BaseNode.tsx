import * as React from "react";
import styled from "styled-components";

export interface BaseNodeProps {
  //   backgroundColor?: string;
  label?: string;
  onClick?: () => void;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  //   backgroundColor,
  label,
  ...props
}) => {
  return (
    <StyledBaseNode mainColor {...props}>
      {label}
    </StyledBaseNode>
  );
};

const StyledBaseNode = styled.button`
  background-color: ${(props) => props.mainColor};
`;
