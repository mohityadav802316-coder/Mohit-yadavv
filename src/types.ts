export type LanguageMode = 'both' | 'en' | 'hi';

export interface VisitorMessage {
  id: string;
  name: string;
  email?: string;
  message: string;
  createdAt?: string | { seconds: number; nanoseconds: number } | any;
  read: boolean;
  archived?: boolean;
  source?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  description: string;
  descriptionHi: string;
  status: 'In Progress' | 'Concept' | 'Active Development' | 'Live Showcase';
  statusHi: 'प्रगति पर है' | 'अवधारणा' | 'सक्रिय विकास' | 'लाइव शोकेस';
  tags: string[];
  features: string[];
  featuresHi: string[];
  targetOutcome: string;
  targetOutcomeHi: string;
  liveUrl?: string;
  githubUrl?: string;
  isAvailable: boolean;
  accentColor?: string;
}

export interface SkillItem {
  id?: string;
  name: string;
  nameHi: string;
  category: 'current' | 'tools' | 'learning';
  icon: string;
  description: string;
  descriptionHi: string;
  highlights: string[];
}

export interface RoadmapMilestone {
  id: string;
  phase: string;
  title: string;
  titleHi: string;
  status: 'completed' | 'in-progress' | 'future';
  statusText: string;
  statusTextHi: string;
  description: string;
  descriptionHi: string;
  topics: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  titleHi: string;
  category: 'setup' | 'ai_creation' | 'coding' | 'blueprint' | 'personal';
  categoryLabel: string;
  categoryLabelHi: string;
  imageUrl: string;
  caption: string;
  captionHi: string;
  isPlaceholder: boolean;
}

export interface PortfolioImage {
  id: string;
  title?: string;
  caption: string;
  captionHi?: string;
  downloadUrl: string;
  storagePath: string;
  section: 'profile' | 'about' | 'gallery' | 'roadmap' | 'hero';
  category: 'personal' | 'setup' | 'ai_creation' | 'coding' | 'blueprint';
  displayOrder: number;
  isPublished: boolean;
  isMainProfile: boolean;
  isHeroOrbit?: boolean;
  orbitIndex?: number;
  createdAt: any;
  updatedAt?: any;
}

export interface ProfileSettings {
  name: string;
  title: string;
  titleHi: string;
  bioEn: string;
  bioHi: string;
  education: string;
  educationHi: string;
  academicBoard: string;
  targetRole: string;
  targetRoleHi: string;
  careerGoalsEn: string[];
  careerGoalsHi: string[];
}

export interface HeroSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroBioEn: string;
  heroBioHi: string;
  orbitCycleInterval: number; // in seconds
  autoRotateSpeed: number; // 0 to 2
  enable3DPhotoOrbit: boolean;
  enableQuantumCore: boolean;
  primaryPhotoId?: string;
  orbitImageIds: string[]; // up to 5 IDs
  particlesEnabled: boolean;
}

export interface ThemeSettings {
  neonColor: 'cyan' | 'magenta' | 'purple' | 'emerald';
  glowIntensity: 'subtle' | 'balanced' | 'high';
  fontFamily: 'rajdhani' | 'orbitron' | 'sans';
  backgroundStyle: 'grid' | 'particles' | 'cyber_matrix';
  soundEnabledByDefault: boolean;
}

export interface SceneSettings {
  activeScenes: {
    hero: boolean;
    cybersecurity?: boolean;
    about: boolean;
    skills: boolean;
    roadmap: boolean;
    projects: boolean;
    gallery: boolean;
    vision: boolean;
    contact: boolean;
  };
  sceneOrder: ('hero' | 'cybersecurity' | 'about' | 'skills' | 'roadmap' | 'projects' | 'gallery' | 'vision' | 'contact')[];
}

export interface ContactSettings {
  email: string;
  githubUrl: string;
  telegramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  location: string;
  locationHi: string;
  responseAvailability: string;
  responseAvailabilityHi: string;
}

export interface SiteSettings {
  profile: ProfileSettings;
  hero: HeroSettings;
  theme: ThemeSettings;
  scenes: SceneSettings;
  contact: ContactSettings;
  projects?: ProjectItem[];
  skills?: SkillItem[];
  milestones?: RoadmapMilestone[];
  isDraft?: boolean;
  lastPublishedAt?: any;
  updatedAt?: any;

  // Backward compatibility fields
  heroTitle?: string;
  heroSubtitle?: string;
  heroBioEn?: string;
  heroBioHi?: string;
  orbitCycleInterval?: number;
  themeColor?: 'cyan' | 'magenta' | 'purple' | 'emerald';
  activeScenes?: {
    hero: boolean;
    about: boolean;
    skills: boolean;
    projects: boolean;
    gallery: boolean;
    vision: boolean;
    contact: boolean;
  };
}
