import React from "react";
import { Switch } from "react-router-dom";
import { useDispatch } from "react-redux";

import { signOut } from "~/store/modules/auth/actions";

import Route from "./Route";
import SignIn from "~/pages/SignIn";
import Notfound from "~/pages/Notfound";
import PaymentForm from "~/pages/PaymentForm";

export default function Routes() {
  const dispatch = useDispatch();
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/paymant-forms" component={PaymentForm} isPrivate />
      <Route
        path="/loggout"
        isPrivate
        component={() => {
          dispatch(signOut());
          return null;
        }}
      />
      <Route path="/" component={Notfound} isPrivate />
    </Switch>
  );
}
