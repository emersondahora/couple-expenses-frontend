import React from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import Proptypes from "prop-types";

import { formatPrice } from "~/util/format";
import { ExpensiveBlock, Collapse } from "../styles";
import CategoryList from "./CategoryList";

export default function OwnerList({
  ownerIndex,
  owner,
  users,
  handleToggleOwner,
  handleToggleCategory
}) {
  return (
    <ExpensiveBlock display_color={owner.display_color} key={owner.user_id}>
      <h1 variant="dark">
        <span>{owner.name}</span>
        <div>
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={
              <Tooltip id="button-tooltip">
                {users
                  .filter(item => item.id !== owner.user_ids)
                  .map(user => (
                    <div key={user.short_name}>
                      {user.short_name} (
                      {formatPrice(
                        owner.divisions.find(item => item.user_id === user.id)
                          .amount
                      )}
                      )
                    </div>
                  ))}
              </Tooltip>
            }
          >
            <span>{formatPrice(owner.amount)}</span>
          </OverlayTrigger>
          <Button variant="link" onClick={() => handleToggleOwner(ownerIndex)}>
            {owner.open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </Button>
        </div>
      </h1>
      <Collapse in={owner.open}>
        <div>
          {owner.categories.map((category, categoryIndex) => (
            <CategoryList
              category={category}
              key={owner.id}
              ownerIndex={ownerIndex}
              categoryIndex={categoryIndex}
              owner_id={owner.user_id}
              users={users}
              handleToggleCategory={handleToggleCategory}
            />
          ))}
        </div>
      </Collapse>
    </ExpensiveBlock>
  );
}

OwnerList.propTypes = {
  ownerIndex: Proptypes.number.isRequired,
  owner: Proptypes.objectOf().isRequired,
  users: Proptypes.arrayOf().isRequired,
  handleToggleOwner: Proptypes.func.isRequired,
  handleToggleCategory: Proptypes.func.isRequired
};
