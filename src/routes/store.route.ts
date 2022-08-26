import {setItemDetails,updateItemInventory,getInventory} from "../controllers/store.controller";

const storeRoute = require("express").Router();

storeRoute.post("/", setItemDetails);
storeRoute.put('/',updateItemInventory);
storeRoute.get('/',getInventory);

// module.exports = storeRoute;

export default storeRoute;
