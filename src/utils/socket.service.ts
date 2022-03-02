import { io } from "socket.io-client";

import port from "src/config/serverPort";

const socket = io(`http://localhost:${port}`);

export default socket;
