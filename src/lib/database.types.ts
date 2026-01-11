export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: number;
          key: string;
          value: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
        };
        Update: {
          key?: string;
          value?: string;
          updated_at?: string;
        };
      };
      hero_content: {
        Row: {
          id: number;
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
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['hero_content']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['hero_content']['Insert']>;
      };
      about_content: {
        Row: {
          id: number;
          paragraph_1: string;
          paragraph_2: string;
          image_url: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['about_content']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['about_content']['Insert']>;
      };
      projects: {
        Row: {
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
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      leadership: {
        Row: {
          id: number;
          title: string;
          date: string;
          role: string;
          organization: string;
          icon: string;
          color: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leadership']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['leadership']['Insert']>;
      };
      awards: {
        Row: {
          id: number;
          title: string;
          description: string;
          is_featured: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['awards']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['awards']['Insert']>;
      };
      special_awards: {
        Row: {
          id: number;
          name: string;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['special_awards']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['special_awards']['Insert']>;
      };
      community: {
        Row: {
          id: number;
          title: string;
          description: string;
          cta_text: string;
          cta_link: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['community']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['community']['Insert']>;
      };
      press: {
        Row: {
          id: number;
          title: string;
          description: string;
          source: string;
          link: string | null;
          is_featured: boolean;
          is_video: boolean;
          color: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['press']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['press']['Insert']>;
      };
      publications: {
        Row: {
          id: number;
          title: string;
          description: string;
          platform: string;
          link: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['publications']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['publications']['Insert']>;
      };
      endorsements: {
        Row: {
          id: number;
          name: string;
          role: string;
          initial: string;
          quote: string;
          color: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['endorsements']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['endorsements']['Insert']>;
      };
      newsletter_issues: {
        Row: {
          id: number;
          title: string;
          link: string;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['newsletter_issues']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['newsletter_issues']['Insert']>;
      };
    };
  };
}

// Helper types
export type Project = Database['public']['Tables']['projects']['Row'];
export type Leadership = Database['public']['Tables']['leadership']['Row'];
export type Award = Database['public']['Tables']['awards']['Row'];
export type SpecialAward = Database['public']['Tables']['special_awards']['Row'];
export type Press = Database['public']['Tables']['press']['Row'];
export type Publication = Database['public']['Tables']['publications']['Row'];
export type Endorsement = Database['public']['Tables']['endorsements']['Row'];
export type NewsletterIssue = Database['public']['Tables']['newsletter_issues']['Row'];
export type HeroContent = Database['public']['Tables']['hero_content']['Row'];
export type AboutContent = Database['public']['Tables']['about_content']['Row'];
export type Community = Database['public']['Tables']['community']['Row'];
