const showPrice = (price: number) => {
  let splitArray: string[] = [];
  while (true) {
    if (price >= 1000) {
      let splitString = "." + price.toString().slice(-3);
      splitArray.unshift(splitString);
      price = Math.floor(price / 1000);
    } else {
      splitArray.unshift(price.toString());
      break;
    }
  }
  const result = splitArray.join("") + "đ";
  return result;
};

export default showPrice;
