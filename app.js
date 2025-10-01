import express from 'express';
import debug from 'debug';
import * as server from './config/server.js';

import { homeRouter } from './routes/home.js';
import { searchRouter } from './routes/search.js';
import { eventRouter } from './routes/event.js';
import { moodRouter } from './routes/mood.js';
import { registerRouter } from './routes/register.js';
import { alertDashboardRouter } from './routes/alertDashboard.js';
import { usersRouter } from './routes/users.js';

// Setup debug module to spit out all messages
// Do `npn start` to see the debug messages
export const codeTrace = debug('comp3028:server');

// Start the app
export const app = express();
server.setup(app)

// Register any middleware here

// Register routers here
app.use('/', homeRouter);
app.use('/', searchRouter);
app.use('/', eventRouter);
app.use('/', moodRouter)
app.use('/', registerRouter);
app.use('/', alertDashboardRouter);
app.use('/',usersRouter)

// Not encouraged, but this is a simple example of how to register a route without a router.
app.get('/test', (req, res) => {
  res.send('Test');
});

// ####################################### No need to modify below this line #######################################
// Start the server
server.errorHandling(app);
export const runningServer = app.listen(server.port, () => {
  console.log(`Example app listening on port http://127.0.0.1:${server.port}`);
  debug('testing');
});

