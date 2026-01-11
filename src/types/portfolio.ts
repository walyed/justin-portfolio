export interface HeroContent {
  badge_text: string;
  subtitle: string;
  name: string;
  tagline: string;
  tagline_highlight: string;
  stat_1_value: string;
  stat_1_label: string;
  stat_2_value: string;
  stat_2_label: string;
  stat_3_value: string;
  stat_3_label: string;
  stat_4_value: string;
  stat_4_label: string;
}

export interface AboutContent {
  paragraph_1: string;
  paragraph_2: string;
  image_url: string;
  tags: string[];
}

export interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  tags: string[];
  awards: string[];
  funding: string | null;
  status: string;
  color: string;
  link?: string | null;
}

export interface Leadership {
  id: number;
  title: string;
  date: string;
  role: string;
  organization: string;
  icon: string;
  color: string;
  link?: string | null;
}

export interface Award {
  id: number;
  title: string;
  description: string;
  is_featured: boolean;
  link?: string | null;
}

export interface SpecialAward {
  id: number;
  name: string;
  link?: string | null;
}

export interface Community {
  title: string;
  description: string;
  cta_text: string;
  cta_link: string;
}

export interface Press {
  id: number;
  title: string;
  description: string;
  source: string;
  link: string | null;
  is_featured: boolean;
  is_video: boolean;
  color: string;
}

export interface Publication {
  id: number;
  title: string;
  description: string;
  platform: string;
  link: string;
}

export interface Endorsement {
  id: number;
  name: string;
  role: string;
  initial: string;
  quote: string;
  color: string;
  link?: string | null;
}

export interface NewsletterIssue {
  id: number;
  title: string;
  issue_number?: string;
  link: string;
}

export interface SectionLayout {
  section_name: string;
  layout: 'grid-2' | 'grid-3' | 'grid-4' | 'list' | 'masonry';
  card_direction: 'vertical' | 'horizontal';
  gap: '2' | '4' | '6' | '8';
  show_image: boolean;
  image_position: 'top' | 'left' | 'right' | 'background';
  image_size: 'sm' | 'md' | 'lg' | 'full';
}

export interface HeroImage {
  id?: number;
  image_url: string;
  alt_text: string;
  brightness: number;
  order_index: number;
  is_active: boolean;
}

export interface PortfolioData {
  hero: HeroContent | null;
  heroImages: HeroImage[];
  about: AboutContent | null;
  projects: Project[];
  leadership: Leadership[];
  awards: Award[];
  specialAwards: SpecialAward[];
  community: Community | null;
  press: Press[];
  publications: Publication[];
  endorsements: Endorsement[];
  newsletterIssues: NewsletterIssue[];
  sectionLayouts: Record<string, SectionLayout>;
  loading: boolean;
  error: string | null;
}
