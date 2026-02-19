import {Router} from 'express';
import { getUser, getUsers } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', getUser);

userRouter.post('/', (req, res) => res.send({body: {title: 'Create new user'}}));

userRouter.put('/:id', (req, res) => res.send({body: {title: 'Update user by ID'}}));

userRouter.delete('/:id', (req, res) => res.send({body: {title: 'Delete user by ID'}}));

export default userRouter;