// pages/api/notifications.ts (or app/api/notifications/route.ts for App Router)
// import { NextApiRequest, NextApiResponse } from 'next';
// import {connect} from '../../../../dbconfig/dbconfig'; // Your MongoDB connection utility
// import Product from '../../../../models/notifymodel';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 

//   try {
//     await connect();

//     const { name, email, phone, product, productId, selectedOptions, totalPrice } = req.body;
// const data = req.body
// console.log(data)
//     // Validate required fields
   

//     // Check if user already requested notification for this product
//     const existingNotification = await Product.findOne({
//       email,
//       productId,
//       status: 'pending'
//     });

//     if (existingNotification) {
//       return res.status(409).json({ 
//         message: 'You have already requested a notification for this product. We will notify you when it\'s back in stock.' 
//       });
//     }

//     // Create new notification
//     const notification = new Product({
//       name,
//       email,
//       phone,
//       product,
//       productId,
//       selectedOptions,
//       totalPrice,
//       status: 'pending'
//     });

//     await notification.save();

//     // Optional: Send immediate email confirmation
//     // await sendNotificationEmail(notification);

//     res.status(201).json({ 
//       message: 'Notification request created successfully!',
//       notificationId: notification._id
//     });

//   } catch (error) {
//     console.error('Error creating notification:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Product from "@/models/notifymodel";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();

    // If SKU is provided, ensure it's a string
    if (body.sku) body.sku = String(body.sku);

    const newProduct = new Product(body);
    await newProduct.save();

    return NextResponse.json({ message: "Product added successfully" }, { status: 201 });
  } catch (error ) { 
    console.error("❌ Error adding product:", error);

    
  }
}
