import {Router} from 'express';

const userRouter = Router();

userRouter.get('/', (req, res) => res.send({body: {title: 'Get all users'}}));
userRouter.get('/:id', (req, res) => res.send({body: {title: 'Get user by ID'}}));
userRouter.post('/', (req, res) => res.send({body: {title: 'Create new user'}}));
userRouter.put('/:id', (req, res) => res.send({body: {title: 'Update user by ID'}}));
userRouter.delete('/:id', (req, res) => res.send({body: {title: 'Delete user by ID'}}));

export default userRouter;