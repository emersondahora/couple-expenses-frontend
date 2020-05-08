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
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

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
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
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

export const HeaderMonth = styled.div`
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  color: #666;
  button {
    color: #666;
    border: none;
    background: none;
    margin: 0px 5px;
  }
  button,
  span {
    line-height: 30px;
    font-size: 16px;
    padding: 5px 10px;
  }
  span {
    font-size: 24px;
  }
`;

export const SummaryContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  div {
    flex: 1;
    padding-top: 5px;
    h1 {
      margin-bottom: 15px;
      margin-left: 5px;
      justify-content: center;
      font-weight: bold;
    }
    table {
      margin: 0px;
      border: 1px solid #ddd;
      box-shadow: 1px 4px 4px rgba(0, 0, 0, 0.25);
    }
  }
  div + div {
    margin-left: 20px;
  }
  tr:hover {
    opacity: 0.9;
  }
`;

export const AddButton = styled.button`
  width: 40px;
  height: 40px;
  position: absolute;
  right: 10px;
  font-size: 20px;
  background: #5cb85c;
  border-radius: 50%;
  color: #fff;
  border: none;
  padding: 5px;

  box-shadow: 1px 4px 4px rgba(0, 0, 0, 0.25);
  &:active {
    background: ${darken(0.1, "#5cb85c")};
    color: ${darken(0.1, "#fff")};
  }
`;
