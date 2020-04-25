import styled from "styled-components";
import { Collapse as BSCollapse } from "react-bootstrap";
import { darken } from "polished";

export const ExpensiveBlock = styled.div`
  & > h1 {
    background: ${props => props.display_color || "#eee"};
    color: ${props => darken(0.6, props.display_color || "#eee")};
    display: flex;
    justify-content: space-between;
    border-radius: 5px;
    padding-left: 10px;
    line-height: 50px;
    margin: 0px;

    small {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  button svg {
    color: ${props => darken(0.6, props.display_color || "#eee")};
  }
  table {
    margin-bottom: 0;
  }
`;

export const Collapse = styled(BSCollapse)`
  margin: 0px 5px;
  padding: 0px;
  margin-bottom: 10px;
  & > div {
    margin: 0;
  }
`;
