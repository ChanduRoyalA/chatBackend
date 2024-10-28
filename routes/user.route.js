import User from "../userSchema.js";
import { Router } from "express";

const userRoute = Router();

userRoute.get('/get', (req, res) => {
    res.send("hello user route")
})
userRoute.post('/new', async (req, res) => {
    try {
        const { name, password, socket } = req.body;
        const getUser = await User.findOne({ name })
        // console.log(getUser)
        if (getUser !== null) {
            res.status(201).send({ error: "User Exists" })
            return;
        }
        const newUser = new User({
            name: name,
            password: password,
            // Activesocket: socket
        })
        await newUser.save();
        res.status(201).send(newUser)

    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})
userRoute.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        const getUser = await User.findOne({ name })
        if (!getUser) {
            res.status(404).send({ error: "Invalid User" })
            return
        }
        if (getUser.password === password) {
            res.status(200).send({ getUser, message: "Logined" })
        }
        else {
            res.status(400).send({ error: "Invalid UserName/Password" })
        }

    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

userRoute.post('/getUser', async (req, res) => {
    try {
        const { name } = req.body;
        const getUser = await User.findOne({ name }).populate('contacts')
        if (!getUser) {
            res.status(404).send({ getUser });
        }
        res.status(200).send(getUser);

    }
    catch (error) {
        res.status(400).send({ error: error.message })
    }
})
userRoute.post('/addUserToContact', async (req, res) => {
    try {
        const { name, username } = req.body;

        // Prevent adding oneself as a contact
        //username -> logined User
        //name -> Contact to be added
        if (name === username) {
            res.status(400).send({ error: "Can't add yourself to contacts" });
            return;
        }

        // Check if the contact user exists
        const getUser1 = await User.findOne({ name });
        if (!getUser1) {
            res.status(404).send({ error: `Cannot find user with name: ${name}` });
            return;
        }

        // Add contact to the current user's contacts
        const getUser = await User.findOneAndUpdate(
            { name: username },
            { $addToSet: { contacts: name } }, // Use $addToSet to avoid duplicates
            { new: true }
        );

        if (!getUser) {
            res.status(404).send({ error: `Cannot find user with name: ${username}` });
            return;
        }

        res.status(200).send(getUser);

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
userRoute.post('/removeUserToContact', async (req, res) => {
    try {
        const { name, username } = req.body;

        // Prevent removing oneself from contacts
        if (name === username) {
            res.status(400).send({ error: "Can't remove yourself from contacts" });
            return;
        }

        // Check if the contact user exists
        const getUser1 = await User.findOne({ name });
        if (!getUser1) {
            res.status(404).send({ error: `Cannot find user with name: ${name}` });
            return;
        }

        // Remove contact from the current user's contacts
        const getUser = await User.findOneAndUpdate(
            { name: username },
            { $pull: { contacts: name } },
            { new: true }
        );

        if (!getUser) {
            res.status(404).send({ error: `Cannot find user with name: ${username}` });
            return;
        }

        res.status(200).send(getUser);

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


export default userRoute 