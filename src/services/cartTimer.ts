import db from "../models/index";
const Mutex = require("async-mutex").Mutex;
const mutex = new Mutex();

/**
 * cart timer - after 10 min if item was not purchase it will be deleted
 */
class CartTimer {
  
    static run() {
    setInterval(async() => {
      for (let cart of db.carts) {
        const cartItems: Array<any> = cart.items;
        for (let item of cartItems) {
          const itemTime: number = item["timestamp"];
          const currentTime: number = Date.now();
          const diff: number = currentTime - itemTime;

          // if pass 10 min remove from cart
          //600000
          if (diff > 4000) {
              // remove item from cart
              const inventoryItemIndex: number = db.inventoriesItems.findIndex(
                (inventoryItem) => inventoryItem.itemID === item.itemID
              );
              const itemIndex: number = db.items.findIndex(
                (item) => item.itemID === item.itemID
              );
              const cartIndex: number = db.carts.findIndex(
                (cart) => cart.userName === cart.userName
              );
              // in order to prevent race condition when writing to inventory and cart
              await mutex.runExclusive(async () => {
              //update total cost
              const cost: number = item["amount"] * db.items[itemIndex]["price"];
              db.carts[cartIndex].totalCost -= cost;
              db.inventoriesItems[inventoryItemIndex]["inventory"] += item.amount;
              db.carts[cartIndex].items = db.carts[cartIndex].items.filter((item) => item.itemID !== item.itemID);
          });
        }
      }
      }
    }, 2000);
  }
}

export default CartTimer;
