import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import Proptypes from "prop-types";

import { ExpensiveBlock, Collapse } from "../styles";
import CategoryList from "./CategoryList";

export default function OwnerList({ owner }) {
  const users = useSelector(state => state.user.users);
  const [openList, setopenList] = useState(true);
  const openListToggle = () => {
    setopenList(!openList);
  };
  return (
    <ExpensiveBlock display_color={owner.display_color}>
      <h1 variant="dark">
        <span>{owner.name}</span>
        <div>
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={
              <Tooltip id="button-tooltip">
                {users.map(user => (
                  <div key={user.short_name}>
                    {user.short_name} (
                    {
                      owner.divisions.find(item => item.user_id === user.id)
                        .amountFormated
                    }
                    )
                  </div>
                ))}
              </Tooltip>
            }
          >
            <span>{owner.amountFormated}</span>
          </OverlayTrigger>
          <Button variant="link" onClick={() => openListToggle()}>
            {openList ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </Button>
        </div>
      </h1>
      <Collapse in={openList}>
        <div>
          {owner.categories.map(category => (
            <CategoryList
              category={category}
              key={category.category_id}
              owner_id={owner.user_id}
              users={users}
            />
          ))}
        </div>
      </Collapse>
    </ExpensiveBlock>
  );
}

OwnerList.propTypes = {
  owner: Proptypes.shape({
    user_id: Proptypes.number,
    name: Proptypes.string,
    display_color: Proptypes.string,
    amountFormated: Proptypes.string,
    categories: Proptypes.arrayOf(Proptypes.shape({})),
    divisions: Proptypes.arrayOf(Proptypes.shape({}))
  }).isRequired
};
