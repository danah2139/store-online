import Cart from '../models/cart.model';
import Item from '../models/item.model'
import InventoryItem from '../models/inventoryItem.model';

class Database {
    carts: Array<Cart>;
    readonly items: Array<Item>;
    readonly inventoriesItems: Array<InventoryItem>;



    constructor(carts:Array<Cart> = [], inventoriesItems:Array<InventoryItem>= [],items:Array<Item>=[]) {
      this.carts = carts;
      this.inventoriesItems = inventoriesItems;
      this.items = items;
    }
  }
  
  export default Database;
  