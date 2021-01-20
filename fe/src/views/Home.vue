<template>
  <div class="container">
    <h1>Our best products</h1>
    <div class="products">
      <div v-for="product in products" :key="product.id">
        <img
          :src="product.image_path"
          width="100%"
          height="250px"
          style="object-fit: cover"
        />
        <div class="bold">{{ product.product_name }}</div>
        <div>{{ product.price.toFixed(2) }} €</div>
        <div>
          <button @click="addToCart(product)">Add to cart</button>
        </div>
        <div>
          <button v-if="isInCart(product)" @click="removeFromCart(product)">
            Remove from cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  props: ["cart"],
  data() {
    return {
      products: [],
    };
  },
  mounted() {
    this.loadProducts();
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
    async loadProducts() {
      try {
        const products = await this.$http.get("/products");
        console.log(products);
        this.products = products.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style scoped>
.products {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    ". . ."
    ". . ."
    ". . .";
}
.products div {
  padding: 1rem;
  text-align: center;
}
</style>
