<template>
  <div class="container">
    <h1>Admin Panel</h1>
    <h2>Orders</h2>
    <table v-if="orders">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Name</th>
          <th>Address</th>
          <th>Created at</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order of orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td class="text-left">{{ order.customer.name }}</td>
          <td class="text-left">
            {{ order.customer.street }} {{ order.customer.streetNumber }},
            {{ order.customer.postcode }} {{ order.customer.city }}
          </td>
          <td>{{ new Date(order.created_at).toLocaleDateString() }}</td>
          <td>{{ order.status }}</td>
          <td>
            <button v-if="order.status != 'PAID'" @click="pay(order.id)">
              Pay
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <hr />
    <h2>Customers</h2>
    <table v-if="customers">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Counter</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer of customers" :key="customer.id">
          <td>
            {{ customer.id }}
          </td>
          <td class="text-left">
            {{ customer.name }}
          </td>
          <td>
            {{ customer.counter }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: null,
      customers: null,
    };
  },
  methods: {
    async loadOrders() {
      try {
        const result = await this.$http.get("/orders");
        this.orders = result.data;
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    },
    async loadCustomers() {
      try {
        const result = await this.$http.get("/customers");
        this.customers = result.data;
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    },
    async pay(id) {
      try {
        const result = await this.$http.patch("/orders/" + id);
        console.log(result);

        this.orders = this.orders.map((order) =>
          order.id == id ? result.data : order
        );
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.loadOrders();
    this.loadCustomers();
  },
};
</script>

<style scoped>
</style>
