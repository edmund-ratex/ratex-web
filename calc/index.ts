import Big from 'big.js';
import {eq} from '@fd/helper/math';

export function calcUnrealisedPnl({side, contractSide, contractSize, qty, entryPrice, exitPrice}): ValueNum {
  if (eq(qty, 0) || eq(entryPrice, 0) || eq(exitPrice, 0)) {
    return '0';
  }

  const entryValue = calcValueBig(contractSide, contractSize, qty, entryPrice);
  const exitValue = calcValueBig(contractSide, contractSize, qty, exitPrice);
  if (side === 'Buy') {
    return exitValue.minus(entryValue).times(contractSide).toString();
  }

  if (side === 'Sell') {
    return entryValue.minus(exitValue).times(contractSide).toString();
  }

  return '0';
}

export function calcValue(contractSide, contractSize, quantity, price) {
  return calcValueBig(contractSide, contractSize, quantity, price).toString();
}

export function calcValueStr(contractSide, contractSize, quantity, price, valuePrecision) {
  const valueBig = calcValueBig(contractSide, contractSize, quantity, price);
  return valueBig.round(valuePrecision, 0).toFixed(valuePrecision);
}

export function calcValueBig(contractSide: ContractSide, contractSize: string, quantity: string, price: string) {
  // TODO:remove
  // if (isNaN(quantity) || quantity === 0 || isNaN(price) || price === 0) {
  //   return Big(0);
  // }
  const tmpBig = Big(quantity).times(contractSize);
  if (contractSide > 0) {
    return tmpBig.times(price);
  }
  if (contractSide < 0) {
    return tmpBig.div(price);
  }
  return Big(0);
}

// export function calcMaxOrderQtyByValue(contract, close) {
//   if (close <= 0) {
//     return Infinity;
//   }
//   const {contractSide, contractSize, priceFactor, maxOrderQty, qtyFactor} = contract;
//   return Number(calcValueBig(contractSide, contractSize, priceFactor, maxOrderQty, close).times(qtyFactor));
// }
//
// export function calcMaxOrderQtyByCoin(contract) {
//   const {maxOrderQty, contractSize, qtyFactor} = contract;
//   return Big(maxOrderQty).times(contractSize).times(qtyFactor);
// }
