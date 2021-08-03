var mongoose = require("mongoose");
var ordersSchema = new mongoose.Schema({
    name: {
        type: String,
        require: require,
    },
    details: {
        itemName: {
            type: String,
            require: require,
        },
        price: {
            type: String,
            require: require
        },
        quantity: {
            type: String,
            require: require
        },
        total: {
            type: Number,
            require: require
        }
    }
});
module.exports = mongoose.model("Orders", ordersSchema);
