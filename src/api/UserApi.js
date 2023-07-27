import { api } from "./configs/axiosConfigs";
import { defineCancelApiObject } from "./configs/axiosUtils";

import React from "react";

export const UserApi = {
  get: async function (name, cancel = false) {
    const response = await api.request({
      url: `/pokemon/${name}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
  post: async function (name, cancel = false) {
    const response = await api.request({
      url: `/pokemon/${name}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(UserApi);
