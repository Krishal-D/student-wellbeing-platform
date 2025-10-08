import express from 'express';
import debug from 'debug';
import * as server from './config/server.js';
import cookieParser from 'cookie-parser';

import { homeRouter } from './routes/home.js';
import { searchRouter } from './routes/search.js';
import { eventRouter } from './routes/event.js';
import { moodRouter } from './routes/mood.js';
import { registerRouter } from './routes/register.js';
import { alertDashboardRouter } from './routes/alertDashboard.js';
import { usersRouter } from './routes/users.js';
import { historyRouter } from './routes/history.js';
import { authRouter } from './routes/auth.js';

import { requireAuth, addUserToViews } from './middleware/auth.js';
import { socialRouter } from './routes/social.js';

// Setup debug module to spit out all messages
// Do `npn start` to see the debug messages
export const codeTrace = debug('comp3028:server');

// Start the app
export const app = express();
server.setup(app)

// register middleware
app.use(cookieParser('your-secret-key-change-in-production')); 
app.use(addUserToViews);

// Authentication middleware - redirect to login if not authenticated
app.use((req, res, next) => {
  // Allow access to login, register, and static files without authentication
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.some(path => req.path.startsWith(path));
  const isStaticFile = req.path.startsWith('/stylesheets') || req.path.startsWith('/images');
  
  if (isPublicPath || isStaticFile) {
    return next();
  }
  
  // For home page, allow access but show limited content if not logged in
  if (req.path === '/') {
    return next();
  }
  
  // All other paths require authentication
  return requireAuth(req, res, next);
});

// Register routers here
app.use('/', authRouter);
app.use('/', homeRouter);
app.use('/', searchRouter);
app.use('/', eventRouter);
app.use('/', moodRouter)
app.use('/', registerRouter);
app.use('/', alertDashboardRouter);
app.use('/', usersRouter);
app.use('/', historyRouter);
app.use('/', socialRouter);

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

