require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db'); // Import the database connection

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
});