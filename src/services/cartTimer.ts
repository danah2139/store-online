import db from "../models/index";

class CartTimer {
  
    static run() {
    setInterval(() => {
      for (let cart of db.carts) {
        const cartItems: Array<any> = cart.items;
        for (let item of cartItems) {
          const itemTime: number = item["timestamp"];
          const currentTime: number = Date.now();
          const diff: number = currentTime - itemTime;

          // if pass 10 min remove from cart
          if (diff > 600000) {
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
            //update total cost
            const cost: number = item["amount"] * db.items[itemIndex]["price"];
            db.carts[cartIndex].totalCost -= cost;
            db.inventoriesItems[inventoryItemIndex]["inventory"] += item.amount;

            db.carts[cartIndex].items.filter(
              (item) => item.itemID !== item.itemID
            );
          }
        }
      }
    }, 2000);
  }
}

export default CartTimer;
