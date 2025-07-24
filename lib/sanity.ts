// lib/sanity.js
import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = sanityClient({
  projectId: '1tr6q688',
  dataset: 'production',
  apiVersion: '2023-01-01', // use current date
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_READ_TOKEN, // add your token here
})

const builder = imageUrlBuilder(client)

export function urlForImage(source: any) {
  return builder.image(source)
}
