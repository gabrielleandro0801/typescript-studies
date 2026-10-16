import { CustomNumber } from "./custom-number";

const money: CustomNumber = new CustomNumber(10);
money.add(new CustomNumber(5));
money.subtract(new CustomNumber(3));
console.log(money.compareTo(new CustomNumber(12)));
