// Routes define the endpoints of the application and also specify which controller function will handle the request for each endpoint. 
// They receive requests from the client and send them to the appropriate controller function for processing.

// import { sign } from 'crypto';

import {Router} from 'express';

import { signIn, signOut, signUp } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out',  signOut);

export default authRouter;