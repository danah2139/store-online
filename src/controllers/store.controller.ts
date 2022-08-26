import express from "express";
import db from "../models/index";
import Item from "../models/item.model";
import InventoryItem from "../models/inventoryItem.model";

interface itemPayloadType {
  item_id: string;
  inventory?: number;
}

const setItemDetails = async (req: express.Request, res: express.Response) => {
  const userName: string = req.body.username;
  const itemID: string = req.body.item_id;
  const price: number = req.body.price;

  if (!userName || !itemID || !price) {
    return res.status(400).send({ message: "please insert fields" });
  }

  if (
    typeof userName !== "string" ||
    typeof itemID !== "string" ||
    typeof price !== "number"
  ) {
    return res.status(400).send({ message: "invalid fields types" });
  }
  if (userName !== "admin") {
    return res.status(401).send({ message: "user is not an admin" });
  }

  const itemsIndex = db.items.findIndex((item) => item.itemID === itemID);

  if (itemsIndex === -1) {
    const item: Item = new Item(itemID, price);
    db.items.push(item);
    const inventoryItem: InventoryItem = new InventoryItem(itemID, 0);
    db.inventoriesItems.push(inventoryItem);
  } else {
    db.items[itemsIndex]["price"] = price;
  }
  return res.send({ message: `item stored ${itemID}` });
};

const updateItemInventory = async (
  req: express.Request,
  res: express.Response
) => {
  const userName: string = req.body.username;
  const itemID: string = req.body.item_id;
  const amount: number = req.body.amount;
  const add: number = req.body.add;

  if (!userName || !itemID) {
    return res.status(400).send({ message: "please insert fields" });
  }
  if (!amount && !add) {
    return res.status(400).send({ message: "please insert add or amount" });
  }
  if (userName !== "admin") {
    return res.status(401).send({ message: "user is not an admin" });
  }
  if (
    typeof userName !== "string" ||
    typeof itemID !== "string" ||
    (typeof amount !== "number" &&
    typeof add !== "number")
  ) {
    return res.status(400).send({ message: "invalid fields types" });
  }

  const itemsIndex = db.items.findIndex((item) => item.itemID === itemID);

  if (itemsIndex === -1) {
    return res.status(400).send({ message: "item not exist" });
  }
  const inventoryItemIndex: number = db.inventoriesItems.findIndex(
    (inventoryItem) => inventoryItem.itemID === itemID
  );
  if (add) {
    db.inventoriesItems[inventoryItemIndex]["inventory"] += add;
  }
  if (amount) {
    db.inventoriesItems[inventoryItemIndex]["inventory"] = amount;
  }
  return res.send({
    item_id: itemID,
    inventory: db.inventoriesItems[inventoryItemIndex]["inventory"],
  });
};

const getInventory = async (req: express.Request, res: express.Response) => {
  const userName: string = req.body.username;
  const items: Array<itemPayloadType> = req.body.items;
  if (!userName) {
    return res.status(400).send({ message: "please insert user name" });
  }

  if (userName !== "admin") {
    return res.status(401).send({ message: "user is not an admin" });
  }

  if (typeof userName !== "string" && !Array.isArray(items)) {
    return res.status(400).send({ message: "invalid fields types" });
  }


  if (!items) {
    return res.send({ items: db.inventoriesItems });
  }

  items.forEach((item, index) => {
    if (!item.item_id) {
      return res
        .status(400)
        .send({ message: "items array do not include item_id" });
    }
    const inventoryItemIndex = db.inventoriesItems.findIndex(
      (inventoryItem) => inventoryItem.itemID === item.item_id
    );
    if (inventoryItemIndex === -1) {
      return res.status(400).send({ message: "item_id is not known" });
    }
    items[index]["inventory"] =
      db.inventoriesItems[inventoryItemIndex]["inventory"];
  });
  return res.send({ items });
};

export { setItemDetails, updateItemInventory, getInventory };
