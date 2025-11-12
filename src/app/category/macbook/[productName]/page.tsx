import Macbookdetails from '@/components/components/macbookcomponents/Macbookdetails';
import React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ productName: string }>; // 👈 mark as Promise
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params; // 👈 await before using
  const { productName } = params;
  console.log('productName:', productName);

  // Fetch product/post data
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URI}/macbooklist/getBySlug/${productName}`,
    { cache: 'no-store' } // optional: avoids stale cache
  );

  if (!res.ok) {
    console.error('Failed to fetch accessory:', res.statusText);
    return {
      title: 'Accessories',
      description: 'View accessory details.',
    };
  }

  const post = await res.json();
  // console.log('data', post.name);

  return {
    title: post.name || 'Accessories',
    description: post.description || 'View accessory details.',
  };
}



const page = () => {
  return (
    <Macbookdetails />
  )
};

export default page;