interface itemType {
  itemID: string;
  price: number;
}

class Item implements itemType {
  readonly itemID: string;
  price: number;

  constructor(itemID: string, price: number) {
    this.itemID = itemID;
    this.price = price;
  }
}

export default Item;
