module.exports = convertToAlphanumeric = input => {
  let lowercaseInput = input.toLowerCase();
  let individualInputsToConvert = input.split(" ");
  let individualInputsToJoin = [];

  individualInputsToConvert.forEach((element, index) => {
    let isADigitContainedWithin = /\d/g;

    if (isNaN(element)) {
      if (isADigitContainedWithin.test(element)) {
        let splitElement = element.split("");
        splitElement.forEach(characterOrDigit =>
          individualInputsToJoin.push(characterOrDigit)
        );
      } else {
        if (
          index === individualInputsToConvert.length - 1 &&
          isADigitContainedWithin.test(individualInputsToConvert[index - 1])
        ) {
          let splitElement = element.split("");
          splitElement.forEach(character =>
            individualInputsToJoin.push(character)
          );
        } else {
          individualInputsToJoin.push(element.charAt(0));
        }
      }
    } else {
      if (element.length > 1) {
        let splitElement = element.split("");
        splitElement.forEach(digit => individualInputsToJoin.push(digit));
      } else {
        individualInputsToJoin.push(parseInt(element));
      }
    }
  });

  let output = individualInputsToJoin.join("");
  return output;
};
