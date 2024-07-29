const { createClient } = require('redis');

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.connect();

const APP_USER_ROOM = 'APP_USER_ROOM';

exports.addUser = async (userId) => redisClient.sAdd(APP_USER_ROOM, userId);

exports.removeUser = async (userId) => redisClient.sRem(APP_USER_ROOM, userId);

exports.getSocketsFromUserId = async (userId) => redisClient.sMembers(userId);

exports.removeUserSocketId = async (userId, socketId) => redisClient.sRem(userId, socketId);

exports.addUserSocketId = async (userId, socketId) => redisClient.sAdd(userId, socketId);

exports.hasUser = async (userId) => redisClient.sIsMember(APP_USER_ROOM, userId);
