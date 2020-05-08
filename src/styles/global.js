import { createGlobalStyle, keyframes } from "styled-components";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export default createGlobalStyle`
    @import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');

    * {
        margin:0;
        padding: 0;
        outline:0;
        box-sizing: border-box;
    }

    *:focus {
        outline: 0;
    }

    html, body, #root {
        height:100%;
        background: #f5f5f5 0% 0% no-repeat padding-box;
    }
    body {
        -webkit-font-smoothing: antialiased;
    }
    body, input, button {
        font: 14px 'Roboto', sans-serif;
    }

    a {
        text-decoration: none;
    }

    ul {
        list-style:none;
    }

    button {
        cursor: pointer;
    }
    .react-datepicker-wrapper {
        display:block;
    }
    .rotate {
        animation: ${rotate} 2s linear infinite;
    }
`;
