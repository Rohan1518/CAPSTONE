require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const makeAdmin = async (email) => {
    try {
        const mongoUri = process.env.DATABASE_URI || process.env.MONGO_URI;
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('❌ User not found:', email);
            process.exit(1);
        }

        console.log('📋 Current user data:');
        console.log('  - Name:', user.name);
        console.log('  - Email:', user.email);
        console.log('  - Current Role:', user.role);

        user.role = 'admin';
        await user.save();

        console.log('✅ User updated successfully!');
        console.log('  - New Role:', user.role);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

// Get email from command line argument or use default
const email = process.argv[2] || 'rohan@gmail.com';
makeAdmin(email);
