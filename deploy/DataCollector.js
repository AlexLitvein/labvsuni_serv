const net = require('net');
const cron = require('node-cron');
const dataColl = new (require('./ISensDataDB_v1.0'))('mongodb://dataCollector:data@127.0.0.1:27017');
const client = new net.Socket();

let task = null;
const cntDays = 31;

// if(process.env.NODE_ENV === 'production') {
//     console.log('We are running in production mode');
// } else {
//    console.log('We are running in development mode');
// }

function GetSensData() {
  // console.log('Tick.');
  // if (doCollect) {
  client.connect(80, '192.168.0.11', function () {
    // console.log('Connected');
    client.write('GET /sensdata');
  });
}

function encodeData(data) {
  let out = 0;
  out = data.getHours() * 1000000 + data.getDate() * 10000 + (data.getMonth() + 1) * 100 + (data.getFullYear() % 100);
  return out;
}

client.on('data', function (data) {
  console.log('Received: ' + data);
  // let sensJSON;
  // let s1 = new String(data);
  const idx = data.indexOf('{');
  if (idx >= 0) {
    data = data.slice(idx);
    const sensJSON = JSON.parse(data);
    // const date = new Date();
    sensJSON._id = new Date();

    console.log('Date: ' + sensJSON._id);

    dataColl.AddCurrSensData(sensJSON);
    if (sensJSON._id.getMinutes() % 60 === 0) {
      dataColl.AddSensData(sensJSON);
      // countMinute = 0;
    }
  }
  // client.destroy(); // kill client after server's response
  client.end();
});

// client.on('close', function() { // Emitted once the socket is fully closed
// console.log('Connection closed');
// });

client.on('error', function () {
  // doCollect = false;
  // client.removeAllListeners(); // тогда не перехватываются исключения при подключении
  console.log('error connection to GodCow');
});

// ┌────────────── second (optional)
// │ ┌──────────── minute
// │ │ ┌────────── hour
// │ │ │ ┌──────── day of month
// │ │ │ │ ┌────── month
// │ │ │ │ │ ┌──── day of week
// * * * * * *
task = cron.schedule(
  '*/5 * * * *',
  () => {
    // */10 * * * *
    // console.log('boom!');
    // countMinute += 10;
    GetSensData();
  },
  { scheduled: true, timezone: 'Asia/Novosibirsk' }
);

task.start();
// task.stop();
