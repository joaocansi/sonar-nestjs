import { Injectable } from '@nestjs/common';

function calculateDiscount(price) {
  if (price > 100) {
    return price * 0.9;
  } else {
    return price;
  }
}

function calculateFinalPrice(price) {
  if (price > 100) {
    return price * 0.9; // Duplicate logic
  } else {
    return price;
  }
}

@Injectable()
export class AppService {
  getHello(): string {
    return calculateDiscount(10) + calculateFinalPrice(10);
  }
}
