import styled from "styled-components";
import { lighten } from "polished";

import { Navbar as NavbarReact } from "react-bootstrap";

export const Navbar = styled(NavbarReact)`
  background-color: #d0d0d0;
  border-bottom: 2px solid #999;
  .logo {
    height: 30px;
  }
`;

// /25px
