<template>
  <div class="container">
    <h1>Order</h1>
    <div class="banner">
      <h3>Advertisement</h3>
      <button @click="incrementCounter()">Click me</button>
    </div>
    <h2>Thank you for your purchase</h2>
    <div>
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
              {{ Number(product.price).toFixed(2) }} x {{ product.quantity }} =
              {{ Number(product.quantity * product.price).toFixed(2) }} €
            </div>
          </div>
        </li>
      </ul>

      <hr />
      <h4>Details</h4>
      <table v-if="order" style="margin: 0 auto">
        <tbody>
          <tr>
            <td class="text-left bold">Status:</td>
            <td class="text-right">{{ order.status }}</td>
          </tr>
          <tr>
            <td class="text-left bold">Date:</td>
            <td class="text-right">{{ orderDate }}</td>
          </tr>
          <tr>
            <td class="text-left bold">Name:</td>
            <td class="text-right">{{ order.customer.name }}</td>
          </tr>
          <tr>
            <td class="text-left bold">Street:</td>
            <td class="text-right">
              {{ order.customer.street }} {{ order.customer.streetNumber }}
            </td>
          </tr>
          <tr>
            <td class="text-left bold">City:</td>
            <td class="text-right">
              {{ order.customer.city }}, {{ order.customer.postcode }}
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
    </div>
  </div>
</template>

<script>
export default {
  name: "Order",
  data() {
    return {
      order: null,
      isInProgress: false,
    };
  },
  mounted() {
    this.loadOrder();
  },
  computed: {
    products() {
      return (this.order && this.order.products) || [];
    },
    orderDate() {
      return new Date(this.order.created_at).toLocaleDateString();
    },
  },
  methods: {
    async loadOrder() {
      try {
        const orderId = this.$route.params.id;
        const { data: order } = await this.$http.get(`/orders/${orderId}`);
        console.log(order);
        this.order = order;
      } catch (error) {
        console.log(error);
      }
    },

    async incrementCounter() {
      try {
        const response = await this.$http.post(
          `/customers/${this.order.customer.id}/counter`
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style scoped>
.banner {
  padding: 2rem;
  background: rgb(238, 174, 202);
  background: linear-gradient(
    27deg,
    rgba(238, 174, 202, 1) 0%,
    rgba(148, 187, 233, 1) 100%
  );
}
</style>
