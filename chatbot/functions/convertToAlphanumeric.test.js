const convertToAlphanumeric = require("./convertToAlphanumeric");

it("should parse a number plate when using words instead of characters and using single digits", () => {
  let input = "dog van 57 sock man uno";

  expect(convertToAlphanumeric(input)).toBe("dv57smu");
});

it("should parse a number plate when using characters or words instead of characters and using single digits with first digit being zero", () => {
  let firstInput = "dog van 07 sock man uno";
  let secondInput = "dv07 sock man uno";
  let thirdInput = "dog van 07 smu";

  expect(convertToAlphanumeric(firstInput)).toBe("dv07smu");
  expect(convertToAlphanumeric(secondInput)).toBe("dv07smu");
  expect(convertToAlphanumeric(thirdInput)).toBe("dv07smu");
});

it("should parse a number plate when using words instead of characters and using double digits", () => {
  let input = "dog van 57 sock man uno";

  expect(convertToAlphanumeric(input)).toBe("dv57smu");
});

it("should parse a number plate when using characters before the digits and using words after the digts", () => {
  let input = "dv57 sock man uno";

  expect(convertToAlphanumeric(input)).toBe("dv57smu");
});

it("should parse a number plate when only using characters and digits", () => {
  let input = "dv57 smu";

  expect(convertToAlphanumeric(input)).toBe("dv57smu");
});

it("should parse a number plate when using words before the digits and characters after the digits", () => {
  let firstInput = "delta van 5 7 smu";
  let secondInput = "delta van 57 smu";

  expect(convertToAlphanumeric(firstInput)).toBe("dv57smu");
  expect(convertToAlphanumeric(secondInput)).toBe("dv57smu");
});

it("should parse a number plate when using a combination of characters and words before the digits and only characters after the digits", () => {
  let firstInput = "d van 5 7 smu";
  let secondInput = "direct v 57 smu";
  expect(convertToAlphanumeric(firstInput)).toBe("dv57smu");
  expect(convertToAlphanumeric(secondInput)).toBe("dv57smu");
});

it("should parse a number plate when using a combination of characters and words before the digits and only words after the digits", () => {
  let firstInput = "dog v 57 sun mario university";
  let secondInput = "d vole 57 seaside many uncouth";
  expect(convertToAlphanumeric(firstInput)).toBe("dv57smu");
  expect(convertToAlphanumeric(secondInput)).toBe("dv57smu");
});

it("should parse a number plate when using only characters before the digits and a combination of characters and words after the digits", () => {
  let firstInput = "dv57 s mario uno";
  let secondInput = "dv57 seriously m u";
  expect(convertToAlphanumeric(firstInput)).toBe("dv57smu");
  expect(convertToAlphanumeric(secondInput)).toBe("dv57smu");
});

it("should parse a number plate when using only words before the digits and a combination of characters and words after the digits", () => {
  let firstInput = "danger vanity 57 s many u";
  let secondInput = "danger vanity 57 sand m uno";
  expect(convertToAlphanumeric(firstInput)).toBe("dv57smu");
  expect(convertToAlphanumeric(secondInput)).toBe("dv57smu");
});

it("should parse a number plate when using a combination of characters and words before the digits and a combination of characters and words after the digits", () => {
  let input = "drink v 57 serious monster u";
  expect(convertToAlphanumeric(input)).toBe("dv57smu");
});

it("should parse postcodes when using only characters and digits", () => {
  let firstInput = "l 1 0 n y";
  let secondInput = "w 1 a 7 g z";
  let thirdInput = "r h 1 7 h f";
  let fourthInput = "r h 1 0 8 j q";
  let fifthInput = "s e 1 p 0 n y";

  expect(convertToAlphanumeric(firstInput)).toBe("l10ny");
  expect(convertToAlphanumeric(secondInput)).toBe("w1a7gz");
  expect(convertToAlphanumeric(thirdInput)).toBe("rh17hf");
  expect(convertToAlphanumeric(fourthInput)).toBe("rh108jq");
  expect(convertToAlphanumeric(fifthInput)).toBe("se1p0ny");
});

it("should parse postcodes when using only words and digits", () => {
  let firstInput = "lima 1 0 november yankee";
  let secondInput = "whisky 1 alpha 7 golf zulu";
  let thirdInput = "romeo hotel 1 7 hotel foxtrot";
  let fourthInput = "romeo hotel 1 0 8 juliet quebec";
  let fifthInput = "sierra echo 1 papa 0 november yankee";

  expect(convertToAlphanumeric(firstInput)).toBe("l10ny");
  expect(convertToAlphanumeric(secondInput)).toBe("w1a7gz");
  expect(convertToAlphanumeric(thirdInput)).toBe("rh17hf");
  expect(convertToAlphanumeric(fourthInput)).toBe("rh108jq");
  expect(convertToAlphanumeric(fifthInput)).toBe("se1p0ny");
});

it("should parse postcodes when using digits and a combination of words and characters", () => {
  let firstInput = "l 1 0 november y";
  let secondInput = "whisky 1 a 7 g zulu";
  let thirdInput = "r h 1 7 hotel foxtrot";
  let fourthInput = "romeo hotel 1 0 8 j quebec";
  let fifthInput = "s echo 1 papa 0 n yankee";

  expect(convertToAlphanumeric(firstInput)).toBe("l10ny");
  expect(convertToAlphanumeric(secondInput)).toBe("w1a7gz");
  expect(convertToAlphanumeric(thirdInput)).toBe("rh17hf");
  expect(convertToAlphanumeric(fourthInput)).toBe("rh108jq");
  expect(convertToAlphanumeric(fifthInput)).toBe("se1p0ny");
});
