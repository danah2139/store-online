import express from "express";
import db from "../models/index";
import Cart from "../models/cart.model";
const Mutex = require("async-mutex").Mutex;
const mutex = new Mutex();

exports.addItemToCart = async (req: express.Request, res: express.Response) => {
  const userName: string = req.body.username;
  const itemID: string = req.body.item_id;
  const quantity: number = req.body.quantity;
  if (!userName || !itemID || !quantity) {
    return res.status(400).send({ message: "please insert fields" });
  }

  if (
    typeof userName !== "string" ||
    typeof itemID !== "string" ||
    typeof quantity !== "number"
  ) {
    return res.status(400).send({ message: "invalid fields types" });
  }
  const inventoryItemIndex: number = db.inventoriesItems.findIndex(
    (item) => item.itemID === itemID
  );
  if (inventoryItemIndex === -1) {
    return res.status(400).send({ message: "item_id is not known" });
  }
  if (quantity < 0) {
    return res
      .status(400)
      .send({ message: "quantity is not positive integer " });
  }
  if (db.inventoriesItems[inventoryItemIndex].inventory < quantity) {
    return res.status(400).send({
      message:
        "inventory of the item_id is smaller than the requested quantity",
    });
  }
  const cartIndex: number = db.carts.findIndex(
    (cart) => cart.userName === userName
  );
  const itemIndex: number = db.items.findIndex(
    (item) => item.itemID === itemID
  );
  const price: number = db.items[itemIndex]["price"];
  db.inventoriesItems[inventoryItemIndex]["inventory"] -= quantity;
  const timestamp = Date.now();

  if (cartIndex === -1) {
    const totalCost: number = quantity * db.items[itemIndex]["price"];
    const cart: Cart = new Cart(userName, totalCost, [
      { itemID, price, amount: quantity, timestamp },
    ]);
    db.carts.push(cart);
    return res.send(JSON.stringify(cart));
  }
  const cartItemIndex: number = db.carts[cartIndex].items.findIndex(
    (item) => item.itemID === itemID
  );
  if (cartItemIndex !== -1) {
    await mutex.runExclusive(async () => {
      db.carts[cartIndex].items[cartItemIndex].amount += quantity;
    })
  } else {
    db.carts[cartIndex].items.push({
      itemID,
      price,
      amount: quantity,
      timestamp,
    });
  }
  db.carts[cartIndex].totalCost += price * quantity;
  return res.send(JSON.stringify(db.carts[cartIndex]));
};

exports.removeItemFromCart = async (
  req: express.Request,
  res: express.Response
) => {
  const userName: string = req.body.username;
  const itemID: string = req.body.item_id;
  if (!userName || !itemID) {
    return res.status(400).send({ message: "please insert fields" });
  }
  if (typeof userName !== "string" || typeof itemID !== "string") {
    return res.status(400).send({ message: "invalid fields types" });
  }
  const cartIndex: number = db.carts.findIndex(
    (cart) => cart.userName === userName
  );
  if (cartIndex === -1) {
    return res.status(400).send({ message: "user cart is not known" });
  }
  const cartItemIndex: number = db.carts[cartIndex].items.findIndex(
    (item) => item.itemID === itemID
  );
  if (cartItemIndex === -1) {
    return res.status(400).send({ message: "item cart is not known" });
  }
  const amountOfItem: number = db.carts[cartIndex].items[cartItemIndex].amount;
  const inventoryItemIndex: number = db.inventoriesItems.findIndex(
    (inventoryItem) => inventoryItem.itemID === itemID
  );
  await mutex.runExclusive(async () => {
    db.inventoriesItems[inventoryItemIndex]["inventory"] += amountOfItem;
        //update total cost
    const itemIndex: number = db.items.findIndex(
      (item) => item.itemID === itemID
    );
    const price: number = db.items[itemIndex]["price"];
    db.carts[cartIndex].totalCost -= price * amountOfItem;
    db.carts[cartIndex].items = db.carts[cartIndex].items.filter(
      (item) => item.itemID !== itemID
    );
  });


  return res.send(JSON.stringify(db.carts[cartIndex]));
};

exports.purchaseItemsInCart = async(req: express.Request, res: express.Response) => {
  const userName: string = req.body.username;
  if (!userName) {
    return res.status(400).send({ message: "please insert username" });
  }
  if (typeof userName !== "string") {
    return res.status(400).send({ message: "invalid username type" });
  }
  const cartIndex: number = db.carts.findIndex(
    (cart) => cart.userName === userName
  );
  if (cartIndex === -1) {
    return res.status(400).send({ message: "user cart is not known" });
  }
  const cart: Cart = db.carts[cartIndex];
  await mutex.runExclusive(async () => {
  db.carts = db.carts.filter((cart) => cart.userName !== userName);
  });
  return res.send(JSON.stringify(cart));
};
