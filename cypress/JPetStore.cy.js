import * as storeHelper from "./support/JPetStoreHelper";
const quantity="5"
const VALID_CREDENTIALS = {
  username: "omar",
  password: "omar0595",
};
describe("JPetStore", () => {
  before(() => {
  storeHelper.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password)
});
  it("verify that cart is empty before add any iteam", () => {
    storeHelper.getReponseOrAddProduct(storeHelper.URL.cart).then((response) => {
    storeHelper.verifyTextExistence(response,[{text:storeHelper.MESSAGE.EMPTY_MESSAGE,exist:true}])
    });
  });
  it("Add Product to Cart and verify it is added", () => {
    storeHelper.getReponseOrAddProduct(storeHelper.URL.addProduct.replace("${id}",storeHelper.PRODUCTS.FISH.LARGE_ANGEL_FISH_ID)).then((response) => {
      storeHelper.verifyProductExistence(response,[{value:storeHelper.PRODUCTS.FISH.TYPE,exist:true}])
      cy.log(response)
      });
  });
  it("check total cost", () => {
    storeHelper.getReponseOrAddProduct(storeHelper.URL.cart).then((response) => {
      storeHelper.checkTotalCost(response,storeHelper.PRODUCTS.FISH.LARGE_ANGEL_FISH_ID);
    });
  });
  it("change quantity and verify it is changed and total cost is changed", () => {
    storeHelper.changeQuantity(quantity);
    storeHelper.getReponseOrAddProduct(storeHelper.URL.cart).then((response) => {
      storeHelper.checkTotalCost(response,storeHelper.PRODUCTS.FISH.LARGE_ANGEL_FISH_ID);
    });
  });
  it('verify "Retuen to main menu" button will redirect user to main page', () => {
    storeHelper.getReponseOrAddProduct(storeHelper.URL.MAIN_MENU).then((response) => {
      storeHelper.verifyTextExistence(response,[{text:storeHelper.MESSAGE.Welcome_MESSAGE.replace("${username}",VALID_CREDENTIALS.username),exist:true}])
    });
  });
  it(`verify"Return to 'product name'" button will redirect user to product page`, () => {
    storeHelper.getReponseOrAddProduct(storeHelper.URL.PRODUCT_PAGE_INFORMATION.replace("${id}",storeHelper.PRODUCTS.FISH.NAME)).then((response) => {
      storeHelper.verifyTextExistence(response,[{text:storeHelper.PRODUCTS.FISH.NAME,exist:true}])
    });
  });
  it("check from sub total", () => {
    storeHelper.getReponseOrAddProduct(storeHelper.URL.cart).then((response) => {
      storeHelper.checkSubTotal(response);
    });
  });
  it("delete product and verify it is deleted", () => {
    storeHelper.deleteProduct(storeHelper.PRODUCTS.FISH.LARGE_ANGEL_FISH_ID).then((response) => {
        storeHelper.verifyProductExistence(response,[{value:storeHelper.PRODUCTS.FISH.TYPE,exist:false}])
      });
  });
  it("verify that cart table is empty after delete all product", () => {
    storeHelper
      .getReponseOrAddProduct(storeHelper.URL.addProduct.replace("${id}",storeHelper.PRODUCTS.DOG.FEMALE_PUPPY_BULL_DOG_ID))
      .then((response) => {
        storeHelper.verifyProductExistence(response,[{value:storeHelper.PRODUCTS.DOG.TYPE,exist:true}])
      });
    storeHelper
      .deleteProduct(storeHelper.PRODUCTS.DOG.FEMALE_PUPPY_BULL_DOG_ID)
      .then((response) => {
        storeHelper.verifyProductExistence(response,[{value:storeHelper.PRODUCTS.DOG.TYPE,exist:false}])
        storeHelper.verifyTextExistence(response,[{text:storeHelper.MESSAGE.EMPTY_MESSAGE,exist:true}])
      });
  });
});
