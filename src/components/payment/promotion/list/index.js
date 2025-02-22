import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Radio } from "antd";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import ListPromo from "./listPromo";
import ListEvents from "./listEvents";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import CreatePromotion from "../create/index";
import { queryGetPlatform } from "../../../../utils/queryPlatform";
import {alertErrorServer} from '../../../../utils/alertErrorAll'
import {
  dispatchSwitchCreatePromo,
  dispatchListPartner,
} from "../../../../redux/actions/index";
import "../../../../static/style/listUsers.css";
function ListPromoAndEvent(props) {
  const [isTypePromo, setIsTypePromo] = useState("promo");
  // const [isCreatePromo, setIsCreatePromo] = useState(false);
  const switchPromoAndEvent = (e) => {
    setIsTypePromo(e.target.value);
  };
  useQuery(queryGetPlatform, {
    fetchPolicy:"cache-and-network",
    onCompleted: (data) => {
      dispatchListPartner(data.listPartners);
    },
    onError: (index) =>
      alertErrorServer(index.message)
  });
  return (
    <>
      {props.isCreatePromo ? (
        <div className="container-listPromo">
          <div className="title">
            <h2>
              Promotion managerment{" "}
              <Button
                className="create-promo"
                onClick={() => dispatchSwitchCreatePromo(false)}
              >
                Create Promotion
              </Button>
            </h2>
          </div>
          <div>
            <Radio.Group
              value={isTypePromo}
              buttonStyle="solid"
              onChange={switchPromoAndEvent}
            >
              <Radio.Button
                value="promo"
                className="btn-switch-listPromo"
                style={{ marginRight: ".5rem" }}
              >
                Promotion for Item
              </Radio.Button>
              <Radio.Button value="event" className="btn-switch-listPromo">
                Promotion for purchase
              </Radio.Button>
            </Radio.Group>
          </div>
          {isTypePromo === "promo" ? (
            <ListPromo isCreatePromo={props.isCreatePromo} />
          ) : (
            <ListEvents isPromo={isTypePromo} />
          )}
        </div>
      ) : (
        <CreatePromotion />
      )}
    </>
  );
}
function mapStateToProps(state) {
  return {
    isCreatePromo: state.isCreatePromo,
  };
}
export default connect(mapStateToProps, null)(ListPromoAndEvent);
