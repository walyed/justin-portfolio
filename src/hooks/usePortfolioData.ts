import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { 
  HeroContent, 
  AboutContent, 
  Community, 
  SectionLayout,
  PortfolioData 
} from '../types/portfolio';

// Re-export types for convenience
export type { 
  HeroContent, 
  AboutContent, 
  Project, 
  Leadership, 
  Award, 
  SpecialAward, 
  Community, 
  SectionLayout,
  Press, 
  Publication, 
  Endorsement, 
  NewsletterIssue, 
  PortfolioData 
} from '../types/portfolio';

// Default data for fallback
const defaultHero: HeroContent = {
  badge_text: 'TOP 20 UNDER 20: 2026 SELECTION',
  subtitle: 'Awarded by Avenue Magazine, YMCA and Calgary Foundation',
  name: 'JOEL AMALDAS',
  tagline: 'Engineering a Future for',
  tagline_highlight: 'Assistive Humanity',
  stat_1_value: '$22.5k',
  stat_1_label: 'Non-Dilutive Funding',
  stat_2_value: '4x',
  stat_2_label: 'Gold Medalist (CYSF)',
  stat_3_value: '2x',
  stat_3_label: 'National Medalist',
  stat_4_value: '200+',
  stat_4_label: 'Students Mentored',
};

const defaultAbout: AboutContent = {
  paragraph_1: 'My name is Joel Amaldas. My journey is defined by a curiosity to explore new technologies and a drive to develop low-cost solutions that enhance accessibility for everyone. I have earned multiple science fair awards for innovative projects, including an AI-powered device for the visually impaired and a brain-controlled wheelchair.',
  paragraph_2: 'Beyond the lab, I volunteer at the Calgary Public Library teaching coding to children and serve as a Youth Leadership Program Leader at Toastmasters International. My goal is to combine technical mastery with social impact to build a more inclusive future.',
  image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800',
  tags: ['Robotics', 'Neuroscience', 'AI & ML', 'Karate (Green Belt)', 'Piano (RCM)'],
};

const defaultCommunity: Community = {
  title: 'Silver AI Initiative',
  description: 'Bridging the generational gap. We conduct seminars, provide books, and training to educate seniors in the AI era.',
  cta_text: 'Donate via GoFundMe',
  cta_link: '#',
};

export function usePortfolioData(): PortfolioData {
  const [data, setData] = useState<PortfolioData>({
    hero: defaultHero,
    about: defaultAbout,
    projects: [],
    leadership: [],
    awards: [],
    specialAwards: [],
    community: defaultCommunity,
    press: [],
    publications: [],
    endorsements: [],
    newsletterIssues: [],
    sectionLayouts: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          heroRes,
          aboutRes,
          projectsRes,
          leadershipRes,
          awardsRes,
          specialAwardsRes,
          communityRes,
          pressRes,
          publicationsRes,
          endorsementsRes,
          newsletterRes,
          layoutsRes,
        ] = await Promise.all([
          supabase.from('hero_content').select('*').single(),
          supabase.from('about_content').select('*').single(),
          supabase.from('projects').select('*').order('order_index'),
          supabase.from('leadership').select('*').order('order_index'),
          supabase.from('awards').select('*').order('order_index'),
          supabase.from('special_awards').select('*').order('order_index'),
          supabase.from('community').select('*').single(),
          supabase.from('press').select('*').order('order_index'),
          supabase.from('publications').select('*').order('order_index'),
          supabase.from('endorsements').select('*').order('order_index'),
          supabase.from('newsletter_issues').select('*').order('order_index'),
          supabase.from('section_layouts').select('*'),
        ]);

        // Process layout data
        const layoutsMap: Record<string, SectionLayout> = {};
        if (layoutsRes.data) {
          layoutsRes.data.forEach((layout: SectionLayout) => {
            layoutsMap[layout.section_name] = layout;
          });
        }

        setData({
          hero: heroRes.data || defaultHero,
          about: aboutRes.data || defaultAbout,
          projects: projectsRes.data || [],
          leadership: leadershipRes.data || [],
          awards: awardsRes.data || [],
          specialAwards: specialAwardsRes.data || [],
          community: communityRes.data || defaultCommunity,
          press: pressRes.data || [],
          publications: publicationsRes.data || [],
          endorsements: endorsementsRes.data || [],
          newsletterIssues: newsletterRes.data || [],
          sectionLayouts: layoutsMap,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load data. Using defaults.',
        }));
      }
    };

    fetchData();
  }, []);

  return data;
}
