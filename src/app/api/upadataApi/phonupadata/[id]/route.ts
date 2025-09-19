import { NextResponse } from "next/server";
import {connect} from '@/dbconfig/dbconfig'
import Product from "@/models/ProductModels";


export async function PUT(request, { params }) {
    try {
      await connect();
      const { id } = params;
      console.log(id)
      const data = await request.json();
      
      const product = await Product.findByIdAndUpdate(id, data, { 
        new: true, 
        runValidators: true 
      });
      
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(product);
    } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }