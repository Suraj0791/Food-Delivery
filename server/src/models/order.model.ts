import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
    restaurant: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    deliveryDetails: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    cartItems: {
        menuId: mongoose.Types.ObjectId;
        quantity: number;
    }[];
    status: string;
    totalAmount?: number;
}

const OrderSchema: Schema = new Schema({
    restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant', required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    deliveryDetails: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    cartItems: [
        {
            menuId: { type: mongoose.Types.ObjectId, ref: 'Menu', required: true },
            quantity: { type: Number, required: true },
        },
    ],
    status: { type: String, required: true },
    totalAmount: { type: Number },
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
