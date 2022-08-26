interface inventoryItemType{
    itemID: string;
    inventory: number;
}

class InventoryItem implements inventoryItemType{
    itemID: string;
    inventory: number;

    
    constructor(itemID:string,inventory:number){
        this.itemID = itemID;
        this.inventory = inventory;

    }
}
export default InventoryItem;