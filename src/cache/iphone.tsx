// lib/getIphoneList.js
import axios from "axios";
import { cache } from "react";

export const getIphoneList = cache(async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getproduct/iphonelist`);
  return res.data;
});
