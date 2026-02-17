import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://elite-document-converter-muhammad-h-peach.vercel.app'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Agar aap ne future mein /about ya /privacy pages banaye, 
    // to wo bhi yahan isi tarah add ho jayenge.
  ]
}
