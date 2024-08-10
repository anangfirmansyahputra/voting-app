import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "1847529",
  key: "9d424f4d7ac8b3f921ae",
  secret: "6f3b44f8de84ca1a3509",
  cluster: "ap1",
  useTLS: true,
});

export const pusherClient = new PusherClient("9d424f4d7ac8b3f921ae", {
  cluster: "ap1",
});
