interface itemType{
    itemID:string,
    price:number,
    amount:number,
    timestamp:number
}

interface cartType{
    userName: string;
    totalCost: number;
    items: Array<itemType>;
}

class Cart implements cartType{
    userName: string;
    totalCost: number;
    items: Array<itemType>;

    
    constructor(userName:string,totalCost:number,items:Array<itemType>=[]){
        this.userName = userName;
        this.totalCost = totalCost;
        this.items = items;

    }
}
export default Cart