import React from "react";
import { RouteProp } from "@react-navigation/native";

import { DetailedTwitt } from "components/detailedTwitt";
import { StackNavigatorParamlist } from "types";

type Props = {
  route: RouteProp<StackNavigatorParamlist, "Details">;
};

const Details = (props: Props) => {
  return <DetailedTwitt {...props.route.params} />;
};

export default Details;
