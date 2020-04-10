import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  min-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;

  h1 {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    color: #444444;
    margin-bottom: 34px;

    ul {
      display: flex;
      li {
        margin: 0 5px;
      }
    }
  }
  .tab-content {
    padding: 20px;
    margin-top: 15px;
    border: 1px solid #dee2e6;
    border-radius: 20px;
    background: #fff;
  }
`;
