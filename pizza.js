document.addEventListener("alpine:init", () => {
    Alpine.data('pizzaCart', () => {
        return {
            pizzas: [],
            cartTotal: 0.00,
            username: '',
            cartId: '',
            cartPizzas: [],
            paymentAmount: 0,
            message: '',
           
            
            
            login() {
                if (this.username.length > 2) {
                    this.createCart();
                } else {
                    alert("username too short");
                }
            },
            
            logout() {
                if (confirm('Do you want to logout?')) {
                    this.username = '';
                    this.cartId = '';
                    localStorage['cartId'] = '';
                    this.createCart() = '';
                }

            },
            createCart() {
                if (!this.username) {
                    this.cartId = "No username to create the cart for."
                    return;
                }
                const cartId = localStorage['cartId'];

                if (cartId) {
                    this.cartId = cartId;
                } else {
                    const createCartURL = ` https://pizza-api.projectcodex.net/api/pizza-cart/create?username=baloyimusa184=${this.username}`
                    return axios.get(createCartURL).then(result => {
                        this.cartId = result.data.cart_code;
                        localStorage['cartId'] = this.cartId;
                    });
                }

            },
            getCart() {
                const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`
                return axios.get(getCartURL);
            },
            addPizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
                    "cart_code": this.cartId,
                    "pizza_id": pizzaId
                })
            },
            removePizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', {
                    "cart_code": this.cartId,
                    "pizza_id": pizzaId
                })
            },
            pay(amount) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/pay', {
                    "cart_code": this.cartId,
                    "amount": amount
                })
            },
            showCartData() {
                this.getCart().then(result => {
                    const cartData = result.data;
                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total.toFixed(2);
                });

            },

            init() {
                axios
                    .get('https://pizza-api.projectcodex.net/api/pizzas')
                    .then(result => {
                        console.log(result.data);
                        this.pizzas = result.data.pizzas;
                    });

                if (!this.cartId) {
                    this.createCart()
                        .then(() => {
                            this.showCartData();
                        })
                }
                this.showCartData();
            },
            addPizzaToCart(pizzaId) {
                //alert(pizzaId)
                this
                    .addPizza(pizzaId)
                    .then(this.showCartData)
            },

            addPizzaToCart(pizzaId) {
                this.addPizza(pizzaId)
                    .then(() => {
                        this.showCartData();
                    })
            },
            removePizzaFromCart(pizzaId) {
                this.removePizza(pizzaId)
                    .then(() => {
                        this.showCartData();
                    })
            },
            payForCart() {
                //alert("pay now " + this.paymentAmount)
                this
                    .pay(this.paymentAmount)
                    .then(result => {
                        if (result.data.status == 'failure') {
                            this.message = result.data.message;
                            setTimeout(() => this.message = '', 2000);
                        }
                        else {
                            this.message = alert('Payment Received');
                            console.log(this.myfunction(this.paymentAmount,this.cartTotal));
                            setTimeout(() => {
                                this.message = '';
                                this.cartPizzas = [];
                                this.cartTotal = 0.00;
                                this.cartId = '';
                                this.createCart();
                                this.paymentAmount = 0;

                                localStorage['cartId'] = '';
                            }, 3000)
                        }
                    })
            }
        }
    });
});