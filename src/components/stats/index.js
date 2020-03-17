import React, { useEffect } from "react";
import { Menu, Icon, Button } from "antd";
import { useState } from "react";
import { dataListStats } from "./statsService";
import { getListPartnerByGame } from "../../utils/query/stats";
import { useQuery } from "@apollo/react-hooks";
import '../../static/style/stats.css'
import ChartStats from "./chartStats";
const { SubMenu } = Menu;

function Stats() {
  const { listNameStats } = dataListStats;
  const [listPartnersByGame, setListPartnerbyGame] = useState([
    { partnerId: "", partnerName: "", fullName: "" }
  ]);
  const [indexStats, setIndexStats] = useState({
    partnerId: "",
    nameStats: "MAU"
  });
  const { partnerId, nameStats } = indexStats;
  useQuery(getListPartnerByGame, {
    onCompleted: data => setListPartnerbyGame(data.listPartnersByGame)
  });
  const handleClick = e => {
    setIndexStats(JSON.parse(e.key));
  };
  useEffect(() => {
    setIndexStats({
      partnerId: "1BA3F861-D4F2-4D97-9F78-38633155EC27",
      nameStats: "DAU"
    });
  }, []);
  const printMenuStats = listPartnersByGame.map(function(value1, i) {
    const printListStats = listNameStats.map((value2, i) => (
      <Menu.Item
        key={`{"partnerId":"${value1.partnerId}","nameStats":"${value2}"}`}
      >
        {value2}
      </Menu.Item>
    ));
    return (
      <SubMenu
        key={`sub${i}`}
        title={
          <span>
            <span>{value1.fullName}</span>
          </span>
        }
      >
        {printListStats}
      </SubMenu>
    );
  });
  return (
    <div className='stats'>
      <Menu onClick={handleClick} style={{ width: "15%" }} mode="inline">
        {printMenuStats}
      </Menu>
      <ChartStats nameStats={nameStats} partnerId={partnerId} />
    </div>
  );
}
export default Stats;
