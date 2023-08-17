

//WHEN USING THIS, MAKE SURE TO TURN OFF PRE('SAVE') IN SCHEMA AND EMAIL REQUIRMENT


/*const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');  // path to the temporarily modified User model
const SALT_ROUNDS = 9;
const env = require('./.env');

const URL = env.mongoURL;

async function hashAndUpdatePasswords() {
    // Connect to the database
    await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        // Fetch all users
        const users = await User.find();

        for (let user of users) {
            // Check if the password doesn't start with bcrypt's typical pattern ($2a$ or $2b$)
            if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
                const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
                user.password = hashedPassword;
                await user.save();
            }
        }

        console.log("All passwords updated successfully");
    } catch (error) {
        console.error("Error updating passwords:", error);
    } finally {
        mongoose.connection.close();
    }
}

hashAndUpdatePasswords();*/



