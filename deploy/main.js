// @babel/register
// require('@babel/register')({
//   presets: ['@babel/preset-react']
// })

const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const { MongoClient } = require('mongodb');
// const logger = require('morgan');
const errorHandler = require('errorhandler');
const compression = require('compression');
const cron = require('node-cron');

let db = null;
let visitCount = 0;
const uri = 'mongodb://labvsuni:lab@134.90.161.173:27617';
// const uri = 'mongodb://labvsuni:lab@127.0.0.1:27017'

//=============================

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

// TODO
// httpServer.listen(3000);
httpServer.listen(80);
console.log('\x1b[33m%s\x1b[0m', 'serv started');

//=============================

io.on('connection', (socket) => {
  visitCount++;
  // console.log(visitCount);
  sendToAll(socket, 'statistic', { visitCount, online: io.engine.clientsCount });

  socket.on('disconnect', () => {
    sendToAll(socket, 'statistic', { visitCount, online: io.engine.clientsCount });
  });
});

function sendToAll(socket, msg, data) {
  socket.emit(msg, data);
  socket.broadcast.emit(msg, data);
}

// ReactDOMServer = require('react-dom/server'),
// React = require('react');
// validator = require('express-validator'),
// const { body, validationResult } = require('express-validator');

// const exphbs = require('express-handlebars');
// app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
// app.set('view engine', 'hbs');

// =====cron=======
// ┌────────────── second (optional)
// │ ┌──────────── minute
// │ │ ┌────────── hour
// │ │ │ ┌──────── day of month
// │ │ │ │ ┌────── month
// │ │ │ │ │ ┌──── day of week
// * * * * * *
const task = cron.schedule(
  '* */24 * * *',
  () => {
    // '0 */1 * * *'
    // console.log('boom!');
    // console.log(visitCount.GetName());
    visitCount = 0;
  },
  {
    scheduled: true,
    timezone: 'Asia/Novosibirsk',
  }
);
task.start();
// task.stop();
// ==================

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    db = client.db('SensDb');
  } catch (err) {
    console.error(err);
  }
  // finally {
  //   // Ensures that the client will close when you finish/error
  //   await client.close();
  // }
}
run().catch(console.dir);

app.use(compression());
// app.use(logger('dev'));
app.use(errorHandler());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(validator())
app.use(express.static('public'));

// app.get('/', (req, res, next) => {
//   visitCount++;
//   next();
// });

app.post('/weather/getSensData', async function (req, res, next) {
  const date = new Date(req.body.startData);
  date.setHours(0);
  const range = parseInt(req.body.range);
  // console.log(`date: ${date}, range: ${range}`);

  // const collName = 'sensData_' + date.getFullYear();
  let coll = db.collection('sensData_' + date.getFullYear());
  let cursor = await coll.find({ _id: { $gte: date } }, { limit: range * 24 + 1, sort: { _id: 1 } });
  const arrData = await cursor.toArray();
  // console.log(data);
  await cursor.close();

  coll = db.collection('currSensData');
  cursor = await coll.findOne({});
  // WARN: cursor в данном случае не нужно закрывать
  // await cursor.close();

  res.json({ currSensData: cursor, arrSensData: arrData });
});

// app.post('/messages', (req, res, next) => {
//   console.log(req.body)
// req.checkBody('message', 'Invalid message in body').notEmpty()
// req.checkBody('name', 'Invalid name in body').notEmpty()
// let newMessage = {
//   message: req.body.message,
//   name: req.body.name
// }
// let errors = req.validationErrors()
// if (errors) return next(errors)
// req.messages.insert(newMessage, (err, result) => {
//   if (err) return next(err)
//   return res.json(result.ops[0])
// })
// })

// app.get('/', (req, res, next) => {
//     res.render('index', {
//       chart: ReactDOMServer.renderToString(React.createElement(SvgChart , { options: options, axis: axis })),

//     })
// })

//   app.get('/', (req, res, next) => {
//     res.render('index', {
//       chart: ReactDOMServer.renderToString(React.createElement(App , { store: {} })),

//     })
// })

// app.get('/', (req, res, next) => {
//   // console.log(req.messages);
//   req.messages.find({ _id: { $gte: new Date('01/05/2021') } }, { limit: (1 * 24) + 1, sort: { _id: 1 } }).toArray((err, docs) => {
//     if (err) return next(err)

//     // console.log('docs',docs);

//     res.render('index', {
//       header: ReactDOMServer.renderToString(Header()),
//       footer: ReactDOMServer.renderToString(Footer()),
//       messageBoard: ReactDOMServer.renderToString(React.createElement(MessageBoard, { messages: docs })),
//       props: '<script type="text/javascript">var messages=' + JSON.stringify(docs) + '</script>'
//     })

//   })
// })

// })
