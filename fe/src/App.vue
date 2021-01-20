<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Products</router-link> |
      <router-link to="/cart">Cart [{{ itemCount }}]</router-link> |
      <router-link to="/admin">Admin</router-link>
    </div>
    <router-view
      @addToCart="addToCart"
      @removeFromCart="removeFromCart"
      @clearCart="clearCart"
      :cart="cart"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      cart: {},
    };
  },
  mounted() {
    const cartItems = this.getCart();
    console.log(cartItems);
    this.cart = cartItems;
  },
  computed: {
    itemCount() {
      let count = 0;

      for (let id in this.cart) {
        count += this.cart[id].count;
      }

      return count;
    },
  },
  methods: {
    getCart() {
      return JSON.parse(localStorage.getItem("cart") || "{}");
    },
    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    clearCart() {
      this.cart = {};
      this.saveCart();
    },
    removeFromCart(product) {
      let cartItems = this.getCart();

      if (product.id in cartItems) {
        if (cartItems[product.id].count === 1) {
          delete cartItems[product.id];
        } else {
          cartItems[product.id].count--;
        }
      }

      this.cart = cartItems;
      this.saveCart();
    },
    addToCart(product) {
      let cartItems = this.getCart();

      if (product.id in cartItems) {
        cartItems[product.id].count++;
      } else {
        cartItems[product.id] = { count: 1, ...product };
      }
      this.cart = cartItems;
      this.saveCart();
    },
  },
};
</script>

<style>
#app {
  font-family:  Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

a {
  font-weight: bold;
  color: #2c3e50;
}

a.router-link-exact-active {
  color: #42b983;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

table {
  margin: 0 auto;
  border-collapse: separate;
  border-spacing: 0 20px;
}

td {
  padding: 0 20px;
}

.text-right {
  text-align: right;
}
.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
.bold {
  font-weight: 700;
}

.uppercase {
  text-transform: uppercase;
}

.faded {
  color: #bbbbbb;
}
.d-block {
  display:block;
}
.small{
  font-size: 12px;
}

.mt-10{
  margin-top: 10px;
}

/* ukradnute z https://codepen.io/seme332/pen/reJOwo */
button {
  width: 200px;
  height: 45px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
}

button:hover {
  background-color: #2ee59d;
  box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
  color: #fff;
  transform: translateY(-7px);
}

</style>
