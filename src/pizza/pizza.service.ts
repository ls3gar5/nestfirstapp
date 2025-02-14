import { Injectable } from '@nestjs/common';
import { Promise } from 'mongoose';

@Injectable()
export class PizzaService {
  private menu = [
    { name: 'Margherita', price: 8 },
    { name: 'Pepperoni', price: 10 },
    { name: 'Hawaiian', price: 10 },
    { name: 'Veggie', price: 9 },
  ];

  private cashInRegister = 100;
  private nextOrderId = 1;
  private orderQueue = [];

  private async addNewPizza(pizzaObj): Promise<void> {
    this.menu.push(pizzaObj);
  }

  private async placeOrder(pizzaName) {
    const selectedPizza = this.menu.find(
      (pizzaObj) => pizzaObj.name === pizzaName,
    );
    this.cashInRegister += selectedPizza.price;
    const newOrder = {
      id: this.nextOrderId++,
      pizza: selectedPizza,
      status: 'ordered',
    };
    this.orderQueue.push(newOrder);
    return newOrder;
  }

  private async completeOrder(orderId) {
    const order = this.orderQueue.find((order) => order.id === orderId);
    order.status = 'completed';
    return order;
  }

  async getOrdersPizza() {
    await Promise.all([
      this.addNewPizza({ name: 'Chicken Bacon Ranch', price: 12 }),
      this.addNewPizza({ name: 'BBQ Chicken', price: 12 }),
      this.addNewPizza({ name: 'Spicy Sausage', price: 11 }),
    ]);

    await this.placeOrder('Chicken Bacon Ranch');
    await this.completeOrder(1);

    console.log('Menu:', this.menu);
    console.log('Cash in register:', this.cashInRegister);
    console.log('Order queue:', this.orderQueue);
  }
}
