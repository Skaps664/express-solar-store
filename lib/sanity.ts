// lib/sanity.js
import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: '1tr6q688',
  dataset: 'production',
  apiVersion: '2023-01-01', // use current date
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_READ_TOKEN, // add your token here

})
