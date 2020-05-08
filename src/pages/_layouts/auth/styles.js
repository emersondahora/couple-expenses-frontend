import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  background: linear-gradient(
    180deg,
    #0084fe 0%,
    rgba(123, 191, 254, 0.473958) 60.94%,
    rgba(89, 172, 249, 0) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 360px;
  text-align: left;
  background: #f0f0f0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 30px 20px;

  form {
    text-align: center;

    img {
      margin-bottom: 20px;
    }
  }
`;
