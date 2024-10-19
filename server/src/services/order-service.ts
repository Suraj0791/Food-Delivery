import OrderRepository from '../repositories/order-repository.ts';
import { Restaurant } from '../models/restraunt.model.ts';
import { IOrder } from '../models/order.model.ts';
import Stripe from 'stripe';
import { ServerConfig } from '../config/server-config.ts';


// The order-service.ts file contains the business logic for creating a checkout session, getting orders, and handling the Stripe webhook. The createCheckoutSession function creates a checkout session for the user to pay for the order. It takes a CheckoutSessionRequest object as input, which contains the cart items, delivery details, and restaurant ID. It fetches the restaurant data from the database and creates an order object with the user, restaurant, delivery details, cart items, and status. It then creates line items for the checkout session using the createLineItems function, which maps the cart items to the menu items and calculates the total amount. It creates a Stripe checkout session with the line items, payment method types, shipping address collection, success URL, cancel URL, and metadata. It saves the order to the database and returns the session URL.

//new stripe takes secfret key nd api version as input and creates a new stripe object. a stripe object is used to interact with the stripe API . the api version is set to 2020-08-27 which is the latest version of the stripe API at the time of writing this code .
//@ts-ignore
const stripe = new Stripe(ServerConfig.STRIPE_SECRET_KEY!, { apiVersion: '2020-08-27' });
const orderRepository = new OrderRepository();

type CheckoutSessionRequest = {
    cartItems: {

        menuId: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
    }[];
    deliveryDetails: {
        name: string;
        email: string;
        address: string;
        city: string;
    };
    restaurantId: string;
};

export const getOrders = async (userId: string) => {
    return orderRepository.findByUserId(userId);
};

//
export const createCheckoutSession = async (checkoutSessionRequest: CheckoutSessionRequest, userId: string) => {
    const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate('menus');
    if (!restaurant) {
        throw new Error('Restaurant not found.');
    }

    //create a new order object with the user, restaurant, delivery details, cart items, and status. the status is set to pending as the order is not confirmed yet. the order object is created using the order model.
    //@ts-ignore
    const order: IOrder = new Order({
        restaurant: restaurant._id,
        user: userId,
        deliveryDetails: checkoutSessionRequest.deliveryDetails,
        cartItems: checkoutSessionRequest.cartItems,
        status: 'pending',
    });

    const menuItems = restaurant.menus;
    //create line items for the checkout session using the createLineItems function. the createLineItems function maps the cart items to the menu items and calculates the total amount. it returns an array of line items that can be used to create a stripe checkout session.
    // a line item is an object that contains the price data and quantity of a menu item. the price data contains the currency, product data, and unit amount of the menu item. the product data contains the name and images of the menu item. the unit amount is the price of the menu item in the smallest currency unit (e.g., cents for USD). the quantity is the number of units of the menu item in the cart.
    const lineItems = createLineItems(checkoutSessionRequest, menuItems);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        shipping_address_collection: {
            allowed_countries: ['GB', 'US', 'CA'],
        },
        line_items: lineItems,
        mode: 'payment',
        success_url: `${ServerConfig.FRONTEND_URL}/order/status`,
        cancel_url: `${ServerConfig.FRONTEND_URL}/cart`,
        metadata: {
            //@ts-ignore
            orderId: order._id.toString(),
            images: JSON.stringify(menuItems.map((item: any) => item.image)),
        },
    });

    if (!session.url) {
        throw new Error('Error while creating session');
    }

    await order.save();
    return session;
};

//handle the stripe webhook event for the checkout.session.completed event. the checkout.session.completed event is triggered when a checkout session is completed successfully. the event contains the session object, which contains the metadata of the order. the metadata contains the order ID, which is used to find the order in the database. the order status is updated to confirmed, and the total amount is updated with the amount_total from the session object. the order is then saved to the database.
export const stripeWebhook = async (payload: string, signature: string) => {
    let event;

    try {
        const secret = ServerConfig.WEBHOOK_ENDPOINT_SECRET!;
        event = stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error: any) {
        throw new Error(`Webhook error: ${error.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        //@ts-ignore
        const order = await Order.findById(session.metadata?.orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        if (session.amount_total) {
            order.totalAmount = session.amount_total;
        }
        order.status = 'confirmed';

        await order.save();
    }
};

export const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any) => {
    return checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item: any) => item._id.toString() === cartItem.menuId);
        if (!menuItem) throw new Error('Menu item id not found');

        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image],
                },
                unit_amount: menuItem.price * 100,
            },
            quantity: cartItem.quantity,
        };
    });
};