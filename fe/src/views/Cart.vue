<template>
  <div class="container">
    <h1>Cart</h1>
    <div v-if="!isEmpty">
      <ul class="product-list">
        <li v-for="product in products" :key="product.id">
          <img
            :src="product.image_path"
            width="200px"
            height="200px"
            style="object-fit: cover"
          />
          <div class="description">
            <div style="font-size: 1.3rem; font-weight: 600">
              {{ product.product_name }}
            </div>
            <div>
              {{ product.price.toFixed(2) }} x {{ product.count }} =
              {{ (product.count * product.price).toFixed(2) }} €
            </div>
          </div>
          <div class="buttons-wrap">
            <div>
              <button @click="addToCart(product)">Add to cart</button>
            </div>
            <div>
              <button v-if="isInCart(product)" @click="removeFromCart(product)">
                Remove from cart
              </button>
            </div>
          </div>
        </li>
      </ul>

      <hr />
      <h2>Total: {{ totalPrice.toFixed(2) }} €</h2>
      <hr />
      <form
        style="
          text-align: start;
          display: flex;
          flex: row;
          margin-top: 50px;
          padding-bottom: 100px;
        "
        @submit.prevent="createOrder"
      >
        <div style="flex-grow: 1; padding: 0 2rem">
          <label class="d-block faded uppercase small">Name</label>
          <input v-model="name" style="margin-top: 5px; width: 100%" />

          <label class="d-block faded uppercase small mt-10">Street</label>
          <input v-model="street" style="margin-top: 5px; width: 100%" />

          <label class="d-block faded uppercase small mt-10"
            >Street Number</label
          >
          <input v-model="streetNumber" style="margin-top: 5px; width: 100%" />
        </div>

        <div
          class="d-block faded uppercase small"
          style="flex-grow: 1; padding: 0 2rem"
        >
          <label style="display: block">City</label>
          <input v-model="city" style="margin-top: 5px; width: 100%" />

          <label class="d-block faded uppercase small mt-10">Post Code</label>
          <input v-model="postcode" style="margin-top: 5px; width: 100%" />

          <div style="margin-top: 35px">
            <button
              style="width: 100%; bottom: 0"
              type="submit"
              :disabled="isInProgress || !isValid"
            >
              Order
            </button>
          </div>
        </div>
      </form>
    </div>
    <div v-else>
      <span class="bold">Your cart is empty</span>
      <hr />
      <router-link to="/">Back to shopping</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  props: ["cart"],
  data() {
    return {
      isInProgress: false,
      name: "",
      street: "",
      streetNumber: "",
      postcode: "",
      city: "",
    };
  },
  computed: {
    isEmpty() {
      return Object.keys(this.cart).length === 0;
    },
    isValid() {
      return (
        this.name.length >= 1 &&
        this.street.length >= 1 &&
        this.streetNumber.length >= 1 &&
        this.postcode.length >= 1 &&
        this.city.length >= 1
      );
    },
    products() {
      let products = [];
      for (let id in this.cart) {
        products.push(this.cart[id]);
      }

      return products;
    },
    totalPrice() {
      let total = 0;

      for (let product of this.products) {
        total += product.count * product.price;
      }

      return total;
    },
  },
  methods: {
    addToCart(product) {
      this.$emit("addToCart", product);
    },
    removeFromCart(product) {
      this.$emit("removeFromCart", product);
    },
    isInCart({ id }) {
      return id in this.cart;
    },
    async createOrder() {
      try {
        const data = {
          cart: this.cart,
          address: {
            name: this.name,
            street: this.street,
            streetNumber: this.streetNumber,
            postcode: this.postcode,
            city: this.city,
          },
        };

        const {
          data: { orderId },
        } = await this.$http.post("orders", data);

        this.$router.push(`/orders/${orderId}`);
        this.$emit("clearCart");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style>
ul.product-list {
  list-style-type: none;
}

ul.product-list li {
  padding: 1rem 0;
  display: flex;
  flex: row;
  justify-content: space-between;
}
ul.product-list li .description {
  padding: 0 1rem;
  flex-grow: 1;
  text-align: start;
}

.description {
  margin: auto;
}
.buttons-wrap {
  display: grid;
  align-items: center;
}
input {
  border-top: 0;
  border-right: 0;
  border-bottom: 1px #555555 solid;
  border-left: 0;
  padding: 1rem 1rem;
  margin: 1rem 0;
  font-size: 18px;
}
</style>
