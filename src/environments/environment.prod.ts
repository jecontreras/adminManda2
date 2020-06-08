import { SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'https://socketsmanda2.herokuapp.com', options: {} };

export const environment = {
  production: true,
  socketConfig: config,
  url: "https://backendmanda.herokuapp.com"
};
