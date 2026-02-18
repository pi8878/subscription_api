// forms the logic of the application and also interact with the database. 
// They receive requests from the routes and send responses back to the client.

import mongoose from "mongoose"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

// what is a re body? req.body is an object containing the data sent by the client in the request body.
// It is typically used in POST and PUT requests to send data to the server. 
// For example, when a user submits a form, the data from the form is sent in the request body 
// and can be accessed using req.body in the controller function that handles the request.

export const signUp = async(req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // logic to create a new user
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser){
            const error = new Error('User with this email already exists');
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{name, email, password: hashedPassword}], {session});

        const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});



        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0],
            }
        })
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}



export const signIn = async(req, res, next) => {

    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user
            }
        });

    } catch (error) {
        next(error);
    }
}

export const signOut = async(req, res, next) => {}