import type { NavItem } from './types'

export const CLUB_INFO = {
  name: 'Rotary Club of Pashupati Kathmandu',
  shortName: 'RC Pashupati Kathmandu',
  address: '09 Sinamangal, Kathmandu, Nepal',
  email: 'pashupatirotaryclub@gmail.com',
  phone: '+977 9851197327',
  hours: 'Sun - Fri  9:00 - 18:00',
  district: '3292',
  motto: 'Service Above Self',
  founded: '1998',
  rotaryInternational: 'https://www.rotary.org',
} as const

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Who We Are',
    href: '/about',
    children: [
      { label: 'About Us', href: '/about' },
      { label: 'TRF Contributors', href: '/about/trf-contributors' },
    ],
  },
  {
    label: 'Members',
    href: '/members',
    children: [
      { label: 'Our Members', href: '/members' },
      { label: 'Board Members', href: '/members#board' },
      { label: 'Rotaract Club', href: '/members#rotaract' },
    ],
  },
  { label: 'Projects', href: '/projects' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'News', href: '/news' },
  { label: 'Publications', href: '/publications' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Contact', href: '/contact' },
]

export const WORKING_AREAS = [
  {
    title: 'Maternal and Child Health',
    description: 'Improving health outcomes for mothers and children across Nepal.',
    icon: 'heart',
    color: '#e74c3c',
    bg: '#fef2f2',
  },
  {
    title: 'Basic Education and Literacy',
    description: 'Empowering communities through quality education and literacy programs.',
    icon: 'book-open',
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    title: 'Economic and Community Development',
    description: 'Creating sustainable livelihoods and building resilient communities.',
    icon: 'trending-up',
    color: '#16a34a',
    bg: '#f0fdf4',
  },
  {
    title: 'Peace and Conflict Prevention',
    description: 'Fostering dialogue, understanding, and peaceful resolution.',
    icon: 'globe',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    title: 'Disease Prevention and Treatment',
    description: 'Combating disease and expanding access to healthcare.',
    icon: 'shield',
    color: '#ea580c',
    bg: '#fff7ed',
  },
  {
    title: 'Water and Sanitation',
    description: 'Providing clean water and sanitation to underserved communities.',
    icon: 'droplets',
    color: '#0891b2',
    bg: '#ecfeff',
  },
] as const

export const CORE_VALUES = [
  {
    title: 'Fellowship',
    description: 'We build lasting bonds through shared service, collaborating locally, nationally, and internationally.',
    icon: 'users',
  },
  {
    title: 'Leadership',
    description: 'We empower teams and communities to create a sustainable and prosperous society.',
    icon: 'star',
  },
  {
    title: 'Integrity',
    description: 'We uphold honesty and moral principles in every action, respecting human diversity.',
    icon: 'shield-check',
  },
  {
    title: 'Services',
    description: 'Service above self — built on honesty, morality, and transparency in all we do.',
    icon: 'hand-heart',
  },
] as const

export const PROJECT_CATEGORIES = ['All', 'Maternal and Child Health', 'Basic Education and Literacy', 'Economic and Community Development', 'Peace and Conflict Prevention', 'Disease Prevention and Treatment', 'Water and Sanitation', 'Others'] as const
export const GALLERY_CATEGORIES = ['All', 'Education', 'Health', 'Empowerment', 'Environment', 'General'] as const
export const ARCHIVE_TYPES = ['All', 'meeting', 'event', 'document'] as const

export const STATS = [
  { label: 'Active Members', value: 50, suffix: '+' },
  { label: 'Projects Completed', value: 100, suffix: '+' },
  { label: 'Years of Service', value: 25, suffix: '+' },
  { label: 'Lives Impacted', value: 10000, suffix: '+' },
] as const

export const SAMPLE_TESTIMONIALS = [
  {
    name: 'PP Juliya',
    role: 'Past President',
    quote: 'We are focused on Service to Humanity. Every project we undertake brings us closer to the world we envision — one where no one is left behind.',
    photo_url: null,
  },
  {
    name: 'Rtr. Jenny Bhattarai',
    role: 'President',
    quote: 'Leading this club has been the greatest honor. Together, we make lasting change in our community every single day.',
    photo_url: null,
  },
  {
    name: 'Rtr. Umesh Sitaula',
    role: 'Secretary',
    quote: 'The bonds we form through service are stronger than anything. Rotary has given me a second family and a higher purpose.',
    photo_url: null,
  },
  {
    name: 'Rtr. Anjan Dangal',
    role: 'SAP Director',
    quote: 'Every act of service, no matter how small, creates ripples of positive change across our community and beyond.',
    photo_url: null,
  },
] as const

export const SITE_CONTENT_DEFAULTS: Record<string, string> = {
  hero_title: 'Service Above Self',
  hero_subtitle: 'Rotary Club of Pashupati Kathmandu — A global network of neighbors, friends, leaders, and problem-solvers committed to lasting change.',
  hero_cta_primary: 'Our Projects',
  hero_cta_secondary: 'About Us',
  about_mission: "The mission of Rotary International is to provide services to others, promote integrity, and advance world understanding, goodwill, and peace through the fellowship of business, professional, and community leaders.",
  about_description: "Rotary is a global network of 1.2 million neighbors, friends, leaders, and problem-solvers who see a world where people unite and take action to create lasting change — across the globe, in our communities, and in ourselves. For more than 110 years we have been committed to sustainable projects that address literacy, peace, water, health, and many other issues facing our world.",
  stats_members: '50+',
  stats_projects: '100+',
  stats_years: '25+',
  stats_lives: '10,000+',
}

export const ACHIEVEMENTS = [
  {
    id: 1,
    title: 'Best Club Award',
    year: '2023–24',
    org: 'District 3292',
    description: 'Awarded for outstanding community service and exemplary member engagement in Rotary Year 2023–24, recognized across all clubs in District 3292.',
    icon: 'trophy',
  },
  {
    id: 2,
    title: 'Paul Harris Fellow',
    year: '2022–23',
    org: 'TRF Recognition',
    description: 'Multiple members recognized as Paul Harris Fellows for significant cumulative contributions to The Rotary Foundation, funding humanitarian projects worldwide.',
    icon: 'award',
  },
  {
    id: 3,
    title: 'Presidential Citation',
    year: '2021–22',
    org: 'RI President',
    description: 'Received the prestigious RI Presidential Citation for achieving goals in membership growth, impactful service projects, and strong leadership development programs.',
    icon: 'star',
  },
  {
    id: 4,
    title: 'Club Excellence Award',
    year: '2020–21',
    org: 'District 3292',
    description: 'Recognized for exemplary performance in club administration, effective project implementation, and maintaining high standards of Rotary fellowship.',
    icon: 'medal',
  },
  {
    id: 5,
    title: 'Environmental Service Award',
    year: '2019–20',
    org: 'District 3292',
    description: 'Honored for the Rotary Prahari Batika project — over 10,000 trees planted across Kathmandu Valley, significantly contributing to urban green cover and environmental awareness.',
    icon: 'leaf',
  },
] as const

