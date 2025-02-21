const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config(); // Load environment variables from.env file

router.get('/users', async (req, res) => {
    try {
        const response = await axios.get(`${process.env.CLERK_API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            },
        });

        // Return the list of users to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});
// Endpoint to get users and their session information
router.get('/usersInfo', async (req, res) => {
    try {
        // Fetch the list of users
        const response = await axios.get(`${process.env.CLERK_API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            },
        });

        const users = response.data;

        // Add logic to fetch sessions for each user and check how many times they logged in
        const usersWithSessionInfo = await Promise.all(
            users.map(async (user) => {
                // Fetch sessions for each user
                const sessionResponse = await axios.get(
                    `${process.env.CLERK_API_URL}/users/${user.id}/sessions`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
                        },
                    }
                );

                // Get sessions and calculate login count and devices
                const sessions = sessionResponse.data;
                const loginCount = sessions.length; // Count of sessions is the number of logins
                const devices = sessions.map((session) => session.device); // Get devices used for login

                // Return the user with login count and devices
                return {
                    ...user,
                    loginCount,
                    devices,
                };
            })
        );

        // Return the list of users with session information
        res.json(usersWithSessionInfo);
    } catch (error) {
        console.error('Error fetching users or sessions:', error);
        res.status(500).send('Error fetching users or sessions');
    }
});



module.exports = router;