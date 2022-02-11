import axios from "axios";
import { graphConfig } from "./msalconfig";

const instance = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchSuggestedUser = async (id: string) => {
  return [{ name: id, email: id }];
};

export const createRequest = async (request: any, requestor: string) => {
  try {
    const { data } = await instance.post(`/request?requestor=${requestor}`, {
      ...request,
    });
    return data.data;
  } catch (error) {
    HandleError(error);
  }
};

export const fetchUser = async (id: string) => {
  try {
    const { data } = await instance.get(`/user/${id}`);
    return data.data;
  } catch (error) {
    HandleError(error);
  }
};

export const fetchApprovers = async (zone: string, tower: string) => {
  try {
    const { data } = await instance.get(
      `/approval?zone=${zone}&tower=${tower}`
    );
    return data.data;
  } catch (error) {
    HandleError(error);
  }
};

export const createPositions = async (requestId: number, data: any) => {
  try {
    const response = await instance.post(
      `/position?requestId=${requestId}`,
      data
    );
    return response.data;
  } catch (error) {
    HandleError(error);
  }
};

export const createApproval = async (requestId: number, body: any) => {
  try {
    const { data } = await instance.post(
      `/approval?requestId=${requestId}`,
      body
    );
    return data.data;
  } catch (error) {
    HandleError(error);
  }
};

export const fetchRequests = async (
  where: { [key: string]: any },
  type?: string,
  requestor?: string
) => {
  try {
    const { data } = await instance.get(`/request`, {
      params: { where, type, requestor },
    });
    return data.data;
  } catch (error) {
    HandleError(error);
  }
};

export const fetchRequest = async (id: string) => {
  try {
    const { data } = await instance.get(`/request/${id}`);
    return data.data;
  } catch (error) {
    HandleError(error);
  }
};

export const fetchRequestComments = async (id: string) => {
  try {
    const { data } = await instance.get(`/comment/${id}`);
    return data.data;
  } catch (error) {
    HandleError(error);
  }
};

export const postComment = async (
  requestId: string,
  message: string,
  user: string
) => {
  try {
    const { data } = await instance.post(`/comment/${requestId}`, {
      user,
      message,
    });
    return data.data;
  } catch (error) {
    HandleError(error);
  }
};

export const fetchPositions = async (where: { [key: string]: any }) => {
  try {
    const { data } = await instance.get(`/position`, {
      params: { where: JSON.stringify(where) },
    });
    return data.data;
  } catch (error) {
    HandleError(error);
  }
};

export const updateApproval = async (requestid: number, body: any) => {
  try {
    const { data } = await instance.put(
      `/approval?requestId=${requestid}`,
      body
    );
    return data.data;
  } catch (error) {
    HandleError(error);
  }
};

export const callMsGraphPhoto = async (token: string) => {
  try {
    const response = (await axios.get(graphConfig.graphMeEndpoint, {
      headers: { Authorization: `Bearer ${token}` },
    })) as Response;
    return response.blob();
  } catch (err) {
    HandleError(err);
  }
};

const HandleError = (error: any) => {
  // const { notifDispatch } = useContext(NotifContext);
  console.log(error);
  // notifDispatch({
  //   type: "SHOW_NOTIF",
  //   payload: {
  //     header: "Error",
  //     message: error.response.data.message,
  //     visible: true,
  //   },
  // });

  return null;
};
