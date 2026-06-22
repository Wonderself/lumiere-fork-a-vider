import {
  FileText,
  LayoutGrid,
  UserCircle,
  Home,
  Image,
  Video,
  Music,
} from 'lucide-react'

export interface CreateStep {
  id: string
  number: number
  title: string
  shortTitle: string
  description: string
  href: string
  icon: typeof FileText
  unsplashImage: string
  unsplashThumb: string
  cta: string
}

export const CREATE_STEPS: CreateStep[] = [
  {
    id: 'script',
    number: 1,
    title: 'Write Your Script',
    shortTitle: 'Script',
    description: 'Write or upload your screenplay. Get AI-powered suggestions to polish your story before production.',
    href: '/create/script',
    icon: FileText,
    unsplashImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&h=500&q=80',
    unsplashThumb: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&h=300&q=80',
    cta: 'Upload Your Script',
  },
  {
    id: 'storyboard',
    number: 2,
    title: 'Create Your Storyboard',
    shortTitle: 'Storyboard',
    description: 'Visualize every scene. Generate storyboard frames with AI or upload your own artwork.',
    href: '/create/storyboard',
    icon: LayoutGrid,
    unsplashImage: 'https://images.unsplash.com/photo-1518676590747-1e3bb275183a?auto=format&fit=crop&w=800&h=500&q=80',
    unsplashThumb: 'https://images.unsplash.com/photo-1518676590747-1e3bb275183a?auto=format&fit=crop&w=400&h=300&q=80',
    cta: 'Create a Storyboard',
  },
  {
    id: 'casting',
    number: 3,
    title: 'Cast Your Characters',
    shortTitle: 'Casting',
    description: 'Browse AI actors, create custom characters, or insert yourself into your film.',
    href: '/create/casting',
    icon: UserCircle,
    unsplashImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&h=500&q=80',
    unsplashThumb: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=400&h=300&q=80',
    cta: 'Create Characters',
  },
  {
    id: 'setups',
    number: 4,
    title: 'Design Your Sets',
    shortTitle: 'Setups',
    description: 'Define locations, environments and ambiances. Build mood boards for every scene.',
    href: '/create/setups',
    icon: Home,
    unsplashImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&h=500&q=80',
    unsplashThumb: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&h=300&q=80',
    cta: 'Create Setups',
  },
  {
    id: 'stills',
    number: 5,
    title: 'Generate Still Shots',
    shortTitle: 'Still Shots',
    description: 'Create cinematic still images for each scene. Build your visual library with AI generation.',
    href: '/create/stills',
    icon: Image,
    unsplashImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&h=500&q=80',
    unsplashThumb: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=400&h=300&q=80',
    cta: 'Create Still Shots',
  },
  {
    id: 'videos',
    number: 6,
    title: 'Produce Your Videos',
    shortTitle: 'Videos',
    description: 'Generate video clips, animate scenes, and assemble your sequences with AI-powered tools.',
    href: '/create/videos',
    icon: Video,
    unsplashImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&h=500&q=80',
    unsplashThumb: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&h=300&q=80',
    cta: 'Create Videos',
  },
  {
    id: 'music',
    number: 7,
    title: 'Add Music & SFX',
    shortTitle: 'Music & SFX',
    description: 'Browse audio libraries, generate custom soundtracks and add sound effects to bring your film to life.',
    href: '/create/music',
    icon: Music,
    unsplashImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&h=500&q=80',
    unsplashThumb: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=400&h=300&q=80',
    cta: 'Add Music & SFX',
  },
]
