export type Product = {

    productId:string,
    productName:string,
    productPrice:number,
    productQuantity:number,
    productUrl:string,
    productDescription:string

}

export type User = {

    userName:string,
    isLogged:boolean
}

export type Order = {

    orderId:string,
    orderDate:string,
    orderOwnerName:string,
    isPaid:boolean
    orderProducts:OrderProduct[]
}

export type OrderProduct = {

    order:Order,
    product:Product,
    quantity:number
}