// Get element by ID
var element = (id) => {
    return document.getElementById(id);
};
// Get elements
var username = element('username');
var itemname = element('itemname');
var price = element('price');
var quantity = element('quantity');
var total = element('total');
var submitBtn = element('submit');
// Set default status
var statusDefault = status.textContent;
// Enable Submit button
submitBtn.disabled = false;
var setStatus = (text) => {
    var status = element('status');
    // Set status
    status.textContent = text;
    submitBtn.disabled = true;
    if (text !== statusDefault) {
        // Reset status after few seconds
        setTimeout(() => {
            setStatus(statusDefault);
            username.value = "";
            itemname.value = "";
            price.value = "";
            quantity.value = "";
            total.value = "";
            submitBtn.disabled = false;
        }, 3000);
    }
};
// Connect to socket
var socket = io.connect('http://127.0.0.1:4000');
// Check for connection
if (socket !== undefined) {
    console.log('Connected to socket');
    // Fetch total from server
    socket.on('output', (data) => {
        if (typeof data === 'object') {
            total.value = data.details.total;
            // Fetch latest collection details from server
            updateTable(data);
        }
    });
    // Fetch all the documents from collection
    socket.on('details', (data) => {
        data.forEach(function (document) {
            updateTable(document);
        });
    });
    // Get status From server
    socket.on('status', (data) => {
        // Set message status
        setStatus((typeof data === 'object') ? data.message : data);
    });
    // On clicking submit button
    submitBtn.addEventListener('click', () => {
        // Emit input to server
        socket.emit('input', {
            name: username.value,
            details: {
                itemName: itemname.value,
                price: price.value,
                quantity: quantity.value,
            }
        });
    });
}
// Update table with the given data
var updateTable = (customerDetails) => {
    var table = document.getElementById("myTable");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.innerHTML = customerDetails.name;
    cell1.classList.add("column");
    cell2.innerHTML = customerDetails.details.itemName;
    cell2.classList.add("column");
    cell3.innerHTML = customerDetails.details.price;
    cell3.classList.add("column");
    cell4.innerHTML = customerDetails.details.quantity;
    cell4.classList.add("column");
    cell5.innerHTML = customerDetails.details.total;
    cell5.classList.add("column");
};
