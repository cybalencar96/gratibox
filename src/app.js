import express from 'express';
import cors from 'cors';
import {
    signUp,
    signIn,
    logOut,
    getUserAuthenticated,
} from './controllers/users.js';
import { subscribe } from './controllers/subscribers.js';
import { subscribeSchema } from './schemas/subscribers.js';
import { auth } from './middlewares/auth.js';
import { signUpSchema } from './schemas/users.js';
import { validateBody } from './middlewares/validateRequest.js';

const app = express();

app.use(express.json())
app.use(cors());

app.get('/health', (req, res) => {
    res.sendStatus(200);
});

// USERS
app.post('/sign-up', validateBody(signUpSchema), signUp);
app.post('/sign-in', signIn);
app.post('/log-out', auth, logOut);
app.get('/user', auth, getUserAuthenticated);

// SUBSCRIBERS
app.post('/subscriber', auth, validateBody(subscribeSchema), subscribe)



export default app;