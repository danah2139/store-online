const clients = require("../controllers/client.controller");

const clientRoute = require("express").Router();

clientRoute.post("/", clients.addItemToCart);
clientRoute.delete('/',clients.removeItemFromCart);
clientRoute.post('/purchase',clients.purchaseItemsInCart);

export default clientRoute;