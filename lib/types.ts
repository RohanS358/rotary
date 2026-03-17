export interface Member {
  id: string
  name: string
  role: string | null
  photo_url: string | null
  type: 'board' | 'member' | 'rotaract' | 'rotaract_pktm' | 'rotaract_law'
  bio: string | null
  year: number | null
  active: boolean
  order_index: number
  donation_amount: number | null
  is_trf: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  category: 'Maternal and Child Health' | 'Basic Education and Literacy' | 'Economic and Community Development' | 'Peace and Conflict Prevention' | 'Disease Prevention and Treatment' | 'Water and Sanitation' | 'Others'
  image_url: string | null
  facebook_url: string | null
  date: string | null
  impact_metric: string | null
  active: boolean
  featured: boolean
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  title: string
  image_url: string
  category: 'Education' | 'Health' | 'Empowerment' | 'Environment' | 'General'
  date: string | null
  alt_text: string | null
  created_at: string
}

export interface Archive {
  id: string
  title: string
  description: string | null
  type: 'meeting' | 'event' | 'document'
  date: string | null
  file_url: string | null
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  role: string | null
  quote: string
  photo_url: string | null
  active: boolean
  order_index: number
  created_at: string
}

export interface SiteContent {
  id: string
  key: string
  value: string | null
  type: 'text' | 'image' | 'json'
  label: string | null
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  created_at: string
}

export type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export interface NewsPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: string | null
  cover_image_url: string | null
  category: string
  author: string
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Publication {
  id: string
  title: string
  description: string | null
  file_url: string | null
  cover_image_url: string | null
  category: string
  published: boolean
  published_at: string | null
  created_at: string
}

export interface CalendarEvent {
  id: string
  title: string
  description: string | null
  location: string | null
  starts_at: string
  ends_at: string | null
  all_day: boolean
  category: string
  color: string
  created_at: string
  updated_at: string
}

export interface EventRsvp {
  id: string
  event_id: string
  name: string
  email: string
  status: 'going' | 'interested'
  created_at: string
}
