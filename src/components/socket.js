//import socketIOClient from "socket.io-client";
var mqtt = require('mqtt');

//const socket = socketIOClient('https://retropixel-server.herokuapp.com/');
const client = mqtt.connect('wss://public:public@public.cloud.shiftr.io:443');

export default client
//export default socket