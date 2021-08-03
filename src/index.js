var Orders = require("./models/orders");
require("dotenv").config();
// Mongo URL
var mongoDBUrl = "mongodb://localhost:27017";
// Mongo Client
var mongo = require("mongodb").MongoClient;
// Socket Clinet
var client = require("socket.io").listen(4000).sockets;
// Establish Mongo DB connection
mongo.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, connection) => {
    if (err) {
        throw err;
    }
    console.log("MongoDB Connected");
    client.on("connection", function (socket) {
        // Generic method to emit status of MongoDB to client
        var sendStatus = function (message) {
            socket.emit("status", message);
        };
        // Fetch customer data from information collection
        var fetchData = function () {
            orderDetails.find({}, { projection: { _id: 0 } }).toArray((error, response) => {
                if (error) {
                    return response.status(500).send(error);
                }
                socket.emit("details", response);
            });
        };
        // Specify the database you want to access
        var db = connection.db("orders");
        // Specify the collection you want to work on
        var orderDetails = db.collection("information");
        fetchData();
        // socket.on("fetch", () => { fetchData(); });
        socket.on("input", (data) => {
            var name = data.name;
            var details = data.details;
            var itemName = details.itemName;
            var price = details.price;
            var quantity = details.quantity;
            if (name === "" || itemName === "" || price === "" || quantity === "") {
                // Send error status
                sendStatus("Cannot leave order details blank");
            }
            else {
                // Create payload using schema
                var orderData = new Orders();
                orderData.name = data.name;
                orderData.details = {
                    itemName: data.details.itemName,
                    price: data.details.price,
                    quantity: data.details.quantity,
                    total: price * quantity,
                };
                // Insert into database
                orderDetails.insertOne(orderData, (error) => {
                    if (error) {
                        return response.status(500).send(error);
                    }
                    client.emit("output", orderData);
                    // Send success message to client
                    sendStatus({
                        message: "Data persisted into database successfully",
                        clear: true
                    });
                });
            }
        });
    });
});
