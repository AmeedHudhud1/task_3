let cookie;
export const URL = {
  login: "/actions/Account.action",
  cart: "/actions/Cart.action?viewCart=",
  addProduct: "actions/Cart.action?addItemToCart=&workingItemId=${id}",
  PRODUCT_PAGE_INFORMATION: "/actions/Catalog.action?viewProduct=&productId=${id}",
  CHANGE_QUANTITY: "/actions/Cart.action",
  DELETE: "/actions/Cart.action?removeItemFromCart=&workingItemId=${product}",
  MAIN_MENU: "/actions/Catalog.action",
};
export const TEST_CONSTANTS  = {
  SIGNON: "Login",
  UPDATE: "Update Cart"
}
export const MESSAGE = {
  EMPTY_MESSAGE: "Your cart is empty.",
  Welcome_MESSAGE: "Welcome ${username}!",
}; 
export const PRODUCTS = {
  FISH: {
    NAME: "FISH",
    ANGEL_FISH_ID: "FI-SW-01",
    LARGE_ANGEL_FISH_ID: "EST-1",
    SMALL_ANGEL_FISH_ID: "EST-2",
    TYPE: "Angelfish",
    DESCRIPTION: "Large Angelfish",
    PRICE: "$16.50",
  },
  DOG: {
    NAME: "DOG",
    BULL_DOG_ID: "K9-BD-01",
    MALE_ADULT_BULL_DOG_ID: "EST-6",
    FEMALE_PUPPY_BULL_DOG_ID: "EST-7",
    TYPE: "Bulldog",
  },
  CAT: {
    NAME: "CAT",
    MANX_ID: "FL-DSH-01",
    TAILLESS_MAX_ID: "EST-14",
  },
  REPTILES: {
    NAME: "REPTILES",
    IGUANA_ID: "RP-LI-02",
    GREEN_ADULT_IGUANA_ID: "EST-13",
  },
  BIRD: {
    NAME: "BIRD",
    FINCH_ID: "AV-SB-02",
    ADULT_MALE_FINCH_ID: "EST-19",
  },
};
export const login = (username, password) => {
   cy.request({
    method: "POST",
    url: URL.login,
    body: {
      username: username,
      password: password,
      signon: TEST_CONSTANTS .SIGNON,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.include(MESSAGE.Welcome_MESSAGE.replace("${username}", username)
    );
    const cookies = response.requestHeaders.cookie;
    cookie = cookies; 
  });
};
export const getReponseOrAddProduct = (url) => {
  return cy
    .request({
      method: "GET",
      url: url,
      headers: {
        Cookie: cookie,
      },
    })
    .then((response) => {
      return response.body;
    });
};
export const verifyTextExistence = (response, texts) => {
  texts.forEach(text => {
    if(text.exist){
      expect(response).to.include(text.text);
    }else{
      expect(response).to.not.include(text,text);
    }
  });
};
export const verifyProductExistence = (response, products) => {
  products.forEach(product=>{
    if (product.exist) {
      expect(response).to.include(product.value);
    } else {
      expect(response).to.not.include(product.value);
    }
  })
};
export const changeQuantity = (quantity) => {
  cy.request({
    method: "POST",
    url: URL.CHANGE_QUANTITY,
    headers: { Cookie: cookie },
    form: true,
    body: {
      [PRODUCTS.FISH.LARGE_ANGEL_FISH_ID]:quantity,
      updateCartQuantities : TEST_CONSTANTS .UPDATE  
    },
  }).then((response) => {
    cy.log(response.body);
  });
};
export const deleteProduct = (product) => {
  return cy
    .request({
      method: "GET",
      url: URL.DELETE.replace("${product}", product),
      headers: {
        Cookie: cookie,
      },
    })
    .then((response) => {
      return response.body;
    });
};
export const checkTotalCost = (response, product) => {
  const $body = Cypress.$(response);
  const $input = $body.find(`table input[name="${product}"]`);
  const textContent = $input.val();
  const $parentTRs = $input.closest("tr");
  const $tdsInX = $parentTRs.find("td:nth-child(6)");
  const textContent2 = $tdsInX.text();
  const result2 = parseFloat(textContent2.replace("$", ""));
  const $tdsInX1 = $parentTRs.find("td:nth-child(7)");
  const textContent3 = $tdsInX1.text();
  const result3 = parseFloat(textContent3.replace("$", ""));
  expect(textContent * result2).to.equal(result3);
};
export const checkSubTotal = (body) => {
  Cypress.$(body)
    .find("table")
    .each(function () {
      let sum = 0;
      Cypress.$(this)
        .find("tr:not(:first-child):not(:last-child)")
        .each(function () {
          const $td6 = Cypress.$(this).find("td:nth-child(7)");
          const td6Text = $td6.text().trim().replace("$", "");
          const td6Value = parseFloat(td6Text);
          if (!isNaN(td6Value)) {
            sum += td6Value;
          }
        });
      const $subtotalTd = Cypress.$(body).find('td[colspan="7"]');
      const subtotalText = $subtotalTd.text();
      const subtotalValue = parseFloat(
      subtotalText.split(":")[1].replace("$", "")
      );
      expect(sum).to.equal(subtotalValue)
    });
};