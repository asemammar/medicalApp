const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// connect to db
exports.connect = function(cb) {

    mongoose.connect(
        process.env.DB,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        () => cb()
        );
}
