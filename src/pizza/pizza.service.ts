import { Injectable } from '@nestjs/common';
import { Promise } from 'mongoose';
import { Order, OrderStatus, Pizza } from './pizza.types';

@Injectable()
export class PizzaService {
  private menu: Pizza[] = [
    { name: 'Margherita', price: 8 },
    { name: 'Pepperoni', price: 10 },
    { name: 'Hawaiian', price: 10 },
    { name: 'Veggie', price: 9 },
  ];

  private cashInRegister = 100;
  private nextOrderId = 1;
  private orderQueue: Order[] = [];

  constructor() {
    this.initializeMenu();
  }

  private async initializeMenu() {
    await Promise.all([
      this.addNewPizza({ name: 'Chicken Bacon Ranch', price: 12 }),
      this.addNewPizza({ name: 'BBQ Chicken', price: 12 }),
      this.addNewPizza({ name: 'Spicy Sausage', price: 11 }),
    ]);
  }

  private async addNewPizza(pizzaObj: Pizza): Promise<void> {
    this.menu.push(pizzaObj);
  }

  private async placeOrder(pizzaName: string) {
    const selectedPizza = this.menu.find(
      (pizzaObj) => pizzaObj.name === pizzaName,
    );
    this.cashInRegister += selectedPizza.price;
    const newOrder: Order = {
      id: this.nextOrderId++,
      pizza: selectedPizza,
      status: OrderStatus.ORDERED,
    };
    this.orderQueue.push(newOrder);
    return newOrder;
  }

  private async completeOrder(orderId) {
    const order = this.orderQueue.find((order) => order.id === orderId);
    order.status = OrderStatus.COMPLETED;
    return order;
  }

  async getOrdersPizza(pizzaName: string): Promise<boolean> {
    try {
      await this.placeOrder(pizzaName);
      await this.completeOrder(1);
    } catch (error) {
      console.log('Error:', error);
      return false;
    }
    console.log('Menu:', this.menu);
    console.log('Cash in register:', this.cashInRegister);
    console.log('Order queue:', this.orderQueue);

    return true;
  }
}
