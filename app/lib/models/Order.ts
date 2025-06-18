
import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '@/lib/models/Product'; 


export interface IOrder extends Document {
  id: string;
  userId: string;
  products: IProduct[]; 
}


const OrderSchema: Schema = new Schema({
  userId: { type: String, required: true },
  products: [
    {
     
      _id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: {type:Number,required:true},
     
    },
  ],
}, { timestamps: true }); 

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;