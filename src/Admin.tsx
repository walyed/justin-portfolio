import { useState, useEffect, useCallback } from 'react';
import { supabase, uploadImage } from './lib/supabase';
import { 
  LogOut, Save, Plus, Trash2, ChevronDown, ChevronRight, 
  Upload, X, GripVertical, Home, User, Briefcase, FolderOpen,
  Award, Users, Newspaper, BookOpen, Quote, Mail, Settings,
  Eye, EyeOff, Maximize2, AlignLeft, AlignCenter, AlignRight, Heart, Trophy
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

// Card Style Interface
interface CardStyle {
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  padding: '2' | '4' | '6' | '8' | '10' | '12';
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textAlign: 'left' | 'center' | 'right';
  titleSize: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  descSize: 'xs' | 'sm' | 'base' | 'lg';
}

// Layout Settings Interface
interface LayoutSettings {
  layout: 'grid-2' | 'grid-3' | 'grid-4' | 'list' | 'masonry';
  cardDirection: 'vertical' | 'horizontal';
  gap: '2' | '4' | '6' | '8';
  showImage: boolean;
  imagePosition: 'top' | 'left' | 'right' | 'background';
  imageSize: 'sm' | 'md' | 'lg' | 'full';
}

const defaultCardStyle: CardStyle = {
  borderRadius: 'xl',
  padding: '6',
  shadow: 'lg',
  textAlign: 'left',
  titleSize: 'lg',
  descSize: 'sm'
};

const defaultLayoutSettings: LayoutSettings = {
  layout: 'grid-2',
  cardDirection: 'vertical',
  gap: '6',
  showImage: true,
  imagePosition: 'top',
  imageSize: 'md'
};

// Layout Editor Component
const LayoutEditor = ({ 
  settings, 
  onChange,
  showImageOptions = false,
  onSave,
  sectionName
}: { 
  settings: LayoutSettings; 
  onChange: (settings: LayoutSettings) => void;
  showImageOptions?: boolean;
  onSave?: () => void;
  sectionName?: string;
}) => {
  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-indigo-600" />
          <h4 className="font-bold text-slate-800 text-sm">Layout Settings</h4>
        </div>
        {onSave && (
          <button
            onClick={onSave}
            className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
          >
            <Save className="w-3 h-3" />
            Save Layout
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Grid Layout */}
        <div>
          <label className="text-xs text-slate-600 mb-1 block">Grid Layout</label>
          <select
            value={settings.layout}
            onChange={(e) => onChange({ ...settings, layout: e.target.value as LayoutSettings['layout'] })}
            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
          >
            <option value="grid-2">2 Columns</option>
            <option value="grid-3">3 Columns</option>
            <option value="grid-4">4 Columns</option>
            <option value="list">List (1 Column)</option>
            <option value="masonry">Masonry</option>
          </select>
        </div>
        
        {/* Card Direction */}
        <div>
          <label className="text-xs text-slate-600 mb-1 block">Card Direction</label>
          <div className="flex gap-1">
            <button
              onClick={() => onChange({ ...settings, cardDirection: 'vertical' })}
              className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                settings.cardDirection === 'vertical' 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white border-slate-300 hover:bg-slate-50'
              }`}
            >
              ↕ Vertical
            </button>
            <button
              onClick={() => onChange({ ...settings, cardDirection: 'horizontal' })}
              className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                settings.cardDirection === 'horizontal' 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white border-slate-300 hover:bg-slate-50'
              }`}
            >
              ↔ Horizontal
            </button>
          </div>
        </div>
        
        {/* Gap */}
        <div>
          <label className="text-xs text-slate-600 mb-1 block">Spacing</label>
          <select
            value={settings.gap}
            onChange={(e) => onChange({ ...settings, gap: e.target.value as LayoutSettings['gap'] })}
            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
          >
            <option value="2">Tight</option>
            <option value="4">Normal</option>
            <option value="6">Relaxed</option>
            <option value="8">Loose</option>
          </select>
        </div>

        {showImageOptions && (
          <>
            {/* Show Image */}
            <div>
              <label className="text-xs text-slate-600 mb-1 block">Show Image</label>
              <div className="flex gap-1">
                <button
                  onClick={() => onChange({ ...settings, showImage: true })}
                  className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium ${
                    settings.showImage 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white border-slate-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => onChange({ ...settings, showImage: false })}
                  className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium ${
                    !settings.showImage 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white border-slate-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Image Position */}
            {settings.showImage && (
              <div>
                <label className="text-xs text-slate-600 mb-1 block">Image Position</label>
                <select
                  value={settings.imagePosition}
                  onChange={(e) => onChange({ ...settings, imagePosition: e.target.value as LayoutSettings['imagePosition'] })}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
                >
                  <option value="top">Top</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="background">Background</option>
                </select>
              </div>
            )}

            {/* Image Size */}
            {settings.showImage && (
              <div>
                <label className="text-xs text-slate-600 mb-1 block">Image Size</label>
                <select
                  value={settings.imageSize}
                  onChange={(e) => onChange({ ...settings, imageSize: e.target.value as LayoutSettings['imageSize'] })}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                  <option value="full">Full Width</option>
                </select>
              </div>
            )}
          </>
        )}
      </div>

      {/* Visual Preview */}
      <div className="mt-4 pt-4 border-t border-indigo-200">
        <label className="text-xs text-slate-600 mb-2 block font-medium">Layout Preview</label>
        <div 
          className={`bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border-2 border-dashed border-indigo-300 ${
            settings.layout === 'list' ? 'space-y-3' : 
            settings.layout === 'grid-2' ? 'grid grid-cols-2' : 
            settings.layout === 'grid-3' ? 'grid grid-cols-3' : 
            'grid grid-cols-4'
          }`}
          style={{ gap: settings.layout !== 'list' ? `${parseInt(settings.gap) * 4}px` : undefined }}
        >
          {[1, 2, 3, 4].slice(0, settings.layout === 'list' ? 2 : settings.layout === 'grid-2' ? 4 : settings.layout === 'grid-3' ? 3 : 4).map(i => (
            <div 
              key={i} 
              className={`bg-white rounded-lg border-2 p-3 shadow-sm transition-all duration-300 ${
                settings.cardDirection === 'horizontal' 
                  ? 'flex items-center gap-3 border-green-400 bg-green-50' 
                  : 'border-indigo-200'
              }`}
            >
              {/* Image placeholder - always show to demonstrate direction */}
              <div className={`rounded-md transition-all duration-300 ${
                settings.cardDirection === 'horizontal' 
                  ? 'w-12 h-12 flex-shrink-0 bg-gradient-to-br from-green-300 to-emerald-300' 
                  : 'w-full h-10 mb-2 bg-gradient-to-br from-indigo-200 to-purple-200'
              }`}>
                <div className="w-full h-full flex items-center justify-center text-xs text-white/70 font-bold">
                  {settings.cardDirection === 'horizontal' ? '←→' : '↑↓'}
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                <div className={`h-2.5 rounded-full w-3/4 ${settings.cardDirection === 'horizontal' ? 'bg-green-400' : 'bg-indigo-300'}`} />
                <div className={`h-2 rounded-full w-1/2 ${settings.cardDirection === 'horizontal' ? 'bg-green-300' : 'bg-indigo-200'}`} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2 italic">This shows how cards will be arranged. Click the Eye icon on the section header to preview actual content.</p>
      </div>
    </div>
  );
};

// Card Style Editor Component
const CardStyleEditor = ({ 
  style, 
  onChange,
  showPreview = true
}: { 
  style: CardStyle; 
  onChange: (style: CardStyle) => void;
  showPreview?: boolean;
}) => {
  const radiusOptions = ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];
  const paddingOptions = ['2', '4', '6', '8', '10', '12'];
  const shadowOptions = ['none', 'sm', 'md', 'lg', 'xl', '2xl'];
  const titleSizeOptions = ['sm', 'base', 'lg', 'xl', '2xl', '3xl'];
  const descSizeOptions = ['xs', 'sm', 'base', 'lg'];

  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <Maximize2 className="w-4 h-4 text-indigo-600" />
        <h4 className="font-bold text-slate-800 text-sm">Card Style</h4>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-slate-600 mb-1 block">Border Radius</label>
          <select
            value={style.borderRadius}
            onChange={(e) => onChange({ ...style, borderRadius: e.target.value as CardStyle['borderRadius'] })}
            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg"
          >
            {radiusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-xs text-slate-600 mb-1 block">Padding</label>
          <select
            value={style.padding}
            onChange={(e) => onChange({ ...style, padding: e.target.value as CardStyle['padding'] })}
            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg"
          >
            {paddingOptions.map(opt => (
              <option key={opt} value={opt}>p-{opt}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-xs text-slate-600 mb-1 block">Shadow</label>
          <select
            value={style.shadow}
            onChange={(e) => onChange({ ...style, shadow: e.target.value as CardStyle['shadow'] })}
            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg"
          >
            {shadowOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-xs text-slate-600 mb-1 block">Text Align</label>
          <div className="flex gap-1">
            {(['left', 'center', 'right'] as const).map(align => (
              <button
                key={align}
                onClick={() => onChange({ ...style, textAlign: align })}
                className={`flex-1 py-1.5 rounded-lg border text-sm ${
                  style.textAlign === align 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white border-slate-300 hover:bg-slate-50'
                }`}
              >
                {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}
                {align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}
                {align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-xs text-slate-600 mb-1 block">Title Size</label>
          <select
            value={style.titleSize}
            onChange={(e) => onChange({ ...style, titleSize: e.target.value as CardStyle['titleSize'] })}
            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg"
          >
            {titleSizeOptions.map(opt => (
              <option key={opt} value={opt}>text-{opt}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-xs text-slate-600 mb-1 block">Description Size</label>
          <select
            value={style.descSize}
            onChange={(e) => onChange({ ...style, descSize: e.target.value as CardStyle['descSize'] })}
            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg"
          >
            {descSizeOptions.map(opt => (
              <option key={opt} value={opt}>text-{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {showPreview && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <label className="text-xs text-slate-600 mb-2 block">Preview</label>
          <div 
            className={`bg-white border border-slate-200 overflow-hidden transition-all
              rounded-${style.borderRadius} 
              p-${style.padding} 
              shadow-${style.shadow}
              text-${style.textAlign}
            `}
            style={{
              borderRadius: style.borderRadius === 'none' ? '0' : 
                           style.borderRadius === 'sm' ? '0.125rem' :
                           style.borderRadius === 'md' ? '0.375rem' :
                           style.borderRadius === 'lg' ? '0.5rem' :
                           style.borderRadius === 'xl' ? '0.75rem' :
                           style.borderRadius === '2xl' ? '1rem' :
                           style.borderRadius === '3xl' ? '1.5rem' : '9999px',
              padding: `${parseInt(style.padding) * 4}px`,
              boxShadow: style.shadow === 'none' ? 'none' :
                        style.shadow === 'sm' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' :
                        style.shadow === 'md' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' :
                        style.shadow === 'lg' ? '0 10px 15px -3px rgb(0 0 0 / 0.1)' :
                        style.shadow === 'xl' ? '0 20px 25px -5px rgb(0 0 0 / 0.1)' :
                        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
              textAlign: style.textAlign
            }}
          >
            <h4 className={`font-bold text-slate-900 mb-1 text-${style.titleSize}`}
                style={{ fontSize: style.titleSize === 'sm' ? '0.875rem' : 
                                   style.titleSize === 'base' ? '1rem' :
                                   style.titleSize === 'lg' ? '1.125rem' :
                                   style.titleSize === 'xl' ? '1.25rem' :
                                   style.titleSize === '2xl' ? '1.5rem' : '1.875rem' }}>
              Sample Title
            </h4>
            <p className={`text-slate-600 text-${style.descSize}`}
               style={{ fontSize: style.descSize === 'xs' ? '0.75rem' : 
                                  style.descSize === 'sm' ? '0.875rem' :
                                  style.descSize === 'base' ? '1rem' : '1.125rem' }}>
              This is sample description text that shows how content will appear in the card.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Live Preview Panel Component
const PreviewPanel = ({ 
  item, 
  type,
  style
}: { 
  item: any; 
  type: 'leadership' | 'award' | 'press' | 'publication' | 'endorsement';
  style?: CardStyle;
}) => {
  const s = style || defaultCardStyle;
  
  const getCardStyle = () => ({
    borderRadius: s.borderRadius === 'none' ? '0' : 
                 s.borderRadius === 'sm' ? '0.125rem' :
                 s.borderRadius === 'md' ? '0.375rem' :
                 s.borderRadius === 'lg' ? '0.5rem' :
                 s.borderRadius === 'xl' ? '0.75rem' :
                 s.borderRadius === '2xl' ? '1rem' :
                 s.borderRadius === '3xl' ? '1.5rem' : '9999px',
    padding: `${parseInt(s.padding) * 4}px`,
    boxShadow: s.shadow === 'none' ? 'none' :
              s.shadow === 'sm' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' :
              s.shadow === 'md' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' :
              s.shadow === 'lg' ? '0 10px 15px -3px rgb(0 0 0 / 0.1)' :
              s.shadow === 'xl' ? '0 20px 25px -5px rgb(0 0 0 / 0.1)' :
              '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    textAlign: s.textAlign as 'left' | 'center' | 'right'
  });

  if (type === 'leadership') {
    return (
      <div className="bg-white border border-violet-100 overflow-hidden" style={getCardStyle()}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-slate-900" style={{ fontSize: s.titleSize === 'sm' ? '0.875rem' : s.titleSize === 'lg' ? '1.125rem' : '1.25rem' }}>
            {item.title || 'Position Title'}
          </h4>
          <span className="text-xs font-mono text-violet-600 bg-violet-50 px-2 py-1 rounded">{item.date || '2025'}</span>
        </div>
        <p className="text-slate-600 mb-2" style={{ fontSize: s.descSize === 'xs' ? '0.75rem' : '0.875rem' }}>{item.role || 'Role'}</p>
        <div className="text-xs text-violet-500 font-mono">{item.organization || 'Organization'}</div>
      </div>
    );
  }

  if (type === 'award') {
    return (
      <div className="bg-white border border-yellow-100 overflow-hidden" style={getCardStyle()}>
        <h4 className="font-bold text-slate-900 mb-1" style={{ fontSize: s.titleSize === 'lg' ? '1.125rem' : '1.25rem' }}>
          {item.title || 'Award Title'}
        </h4>
        <p className="text-yellow-700" style={{ fontSize: s.descSize === 'xs' ? '0.75rem' : '0.875rem' }}>
          {item.description || 'Award description'}
        </p>
      </div>
    );
  }

  if (type === 'press') {
    return (
      <div className="bg-white border border-red-100 overflow-hidden" style={getCardStyle()}>
        <div className="text-red-600 text-xs font-bold uppercase tracking-wide mb-2">{item.source || 'Source'}</div>
        <h4 className="font-bold text-slate-900 mb-2" style={{ fontSize: s.titleSize === 'lg' ? '1.125rem' : '1.25rem' }}>
          {item.title || 'Press Title'}
        </h4>
        <p className="text-slate-600" style={{ fontSize: s.descSize === 'xs' ? '0.75rem' : '0.875rem' }}>
          {item.description || 'Description'}
        </p>
      </div>
    );
  }

  if (type === 'endorsement') {
    return (
      <div className="bg-white border border-pink-100 overflow-hidden" style={getCardStyle()}>
        <p className="text-slate-700 italic mb-4" style={{ fontSize: s.descSize === 'sm' ? '0.875rem' : '1rem' }}>
          "{item.quote || 'Quote text here...'}"
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center font-bold text-pink-600 text-xs">
            {item.initial || 'A'}
          </div>
          <div>
            <div className="text-slate-900 font-bold text-sm">{item.name || 'Name'}</div>
            <div className="text-pink-600 text-xs">{item.role || 'Role'}</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Types
interface Project {
  id?: number;
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
}

interface Leadership {
  id?: number;
  title: string;
  date: string;
  role: string;
  organization: string;
  icon: string;
  color: string;
  order_index: number;
}

interface AwardItem {
  id?: number;
  title: string;
  description: string;
  is_featured: boolean;
  order_index: number;
}

interface SpecialAward {
  id?: number;
  name: string;
  order_index: number;
}

interface Press {
  id?: number;
  title: string;
  description: string;
  source: string;
  link: string | null;
  is_featured: boolean;
  is_video: boolean;
  color: string;
  order_index: number;
}

interface Publication {
  id?: number;
  title: string;
  description: string;
  platform: string;
  link: string;
  order_index: number;
}

interface Endorsement {
  id?: number;
  name: string;
  role: string;
  initial: string;
  quote: string;
  color: string;
  order_index: number;
}

interface NewsletterIssue {
  id?: number;
  title: string;
  link: string;
  month?: string;
  order_index: number;
}

interface CommunityEvent {
  id?: number;
  title: string;
  description?: string;
  link: string;
  month?: string;
  order_index: number;
}

interface NewsletterSubscriber {
  id?: number;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  source: string;
  name?: string;
  notes?: string;
}

interface HeroImage {
  id?: number;
  image_url: string;
  alt_text: string;
  brightness: number;
  order_index: number;
  is_active: boolean;
}

interface HeroContent {
  id?: number;
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

interface AboutContent {
  id?: number;
  paragraph_1: string;
  paragraph_2: string;
  image_url: string;
  tags: string[];
}

interface CommunityContent {
  id?: number;
  title: string;
  description: string;
  cta_text: string;
  cta_link: string;
}

interface Footer {
  id?: number;
  name: string;
  roles: string[];
  location: string;
  education_title: string;
  education_items: string[];
  status_text: string;
  status_available: boolean;
  contact_email: string;
  linkedin_url: string;
  github_url: string;
  email_url: string;
}

// Reusable Components
const ImageUploader = ({ currentUrl, onUpload, label }: { currentUrl: string; onUpload: (url: string) => void; label: string }) => {
  const [uploading, setUploading] = useState(false);
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    setUploading(true);
    const url = await uploadImage(file, 'portfolio-images', 'uploads');
    if (url) {
      onUpload(url);
    }
    setUploading(false);
  }, [onUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxFiles: 1 
  });
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400'
        }`}
      >
        <input {...getInputProps()} />
        {currentUrl ? (
          <div className="relative">
            <img src={currentUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>
        ) : (
          <div className="py-4">
            {uploading ? (
              <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Drag & drop or click to upload</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TagInput = ({ tags, onChange, label }: { tags: string[]; onChange: (tags: string[]) => void; label: string }) => {
  const [input, setInput] = useState('');
  
  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      onChange([...tags, input.trim()]);
      setInput('');
    }
  };
  
  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-1">
            {tag}
            <button onClick={() => removeTag(i)} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Type and press Enter"
        />
        <button onClick={addTag} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ColorSelect = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => {
  const colors = ['slate', 'red', 'pink', 'violet', 'blue', 'cyan', 'emerald', 'yellow', 'indigo'];
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex gap-2">
        {colors.map(color => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              value === color ? 'border-slate-900 scale-110' : 'border-transparent'
            }`}
            style={{ backgroundColor: `var(--color-${color}-500, ${color === 'slate' ? '#64748b' : color === 'red' ? '#ef4444' : color === 'pink' ? '#ec4899' : color === 'violet' ? '#8b5cf6' : color === 'blue' ? '#3b82f6' : color === 'cyan' ? '#06b6d4' : color === 'emerald' ? '#10b981' : color === 'yellow' ? '#eab308' : '#6366f1'})` }}
          />
        ))}
      </div>
    </div>
  );
};

const IconSelect = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => {
  const icons = ['Crown', 'Globe', 'Award', 'Heart', 'Briefcase', 'Users', 'BookOpen'];
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
      >
        {icons.map(icon => (
          <option key={icon} value={icon}>{icon}</option>
        ))}
      </select>
    </div>
  );
};

// Section Preview Modal
const SectionPreviewModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900">Preview: {title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-6 bg-slate-100">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {children}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <a 
            href="/" 
            target="_blank" 
            className="px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
          >
            Open Live Site →
          </a>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

// Section Components
const SectionWrapper = ({ 
  title, 
  icon: Icon, 
  children, 
  isOpen, 
  onToggle,
  onPreview,
  previewContent
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
  isOpen: boolean; 
  onToggle: () => void;
  onPreview?: () => void;
  previewContent?: React.ReactNode;
}) => {
  const [showPreview, setShowPreview] = useState(false);
  
  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <button onClick={onToggle} className="flex items-center gap-3 flex-1 text-left">
            <Icon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          </button>
          <div className="flex items-center gap-2">
            {previewContent && (
              <button 
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview Section
              </button>
            )}
            <button onClick={onToggle}>
              {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
            </button>
          </div>
        </div>
        {isOpen && <div className="px-6 pb-6 border-t border-slate-100 pt-4">{children}</div>}
      </div>
      
      {previewContent && (
        <SectionPreviewModal 
          isOpen={showPreview} 
          onClose={() => setShowPreview(false)} 
          title={title}
        >
          {previewContent}
        </SectionPreviewModal>
      )}
    </>
  );
};

// Main Admin Component
export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Content state
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [communityContent, setCommunityContent] = useState<CommunityContent | null>(null);
  const [footer, setFooter] = useState<Footer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [leadership, setLeadership] = useState<Leadership[]>([]);
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [specialAwards, setSpecialAwards] = useState<SpecialAward[]>([]);
  const [press, setPress] = useState<Press[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [newsletterIssues, setNewsletterIssues] = useState<NewsletterIssue[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [communityEvents, setCommunityEvents] = useState<CommunityEvent[]>([]);
  
  // UI state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ hero: true });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [previewItem, setPreviewItem] = useState<number | null>(null);
  const [heroFrameSize, setHeroFrameSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  // Layout settings for each section
  const [sectionLayouts, setSectionLayouts] = useState<Record<string, LayoutSettings>>({
    leadership: { ...defaultLayoutSettings },
    projects: { ...defaultLayoutSettings, showImage: true, imagePosition: 'top' },
    awards: { ...defaultLayoutSettings },
    press: { ...defaultLayoutSettings },
    publications: { ...defaultLayoutSettings, layout: 'list' },
    endorsements: { ...defaultLayoutSettings },
  });
  
  const updateSectionLayout = (section: string, settings: LayoutSettings) => {
    setSectionLayouts(prev => ({ ...prev, [section]: settings }));
  };

  // Save layout settings to Supabase
  const saveLayoutSettings = async (section: string) => {
    const settings = sectionLayouts[section];
    if (!settings) return;
    
    try {
      const { error } = await supabase
        .from('section_layouts')
        .upsert({
          section_name: section,
          layout: settings.layout,
          card_direction: settings.cardDirection,
          gap: settings.gap,
          show_image: settings.showImage,
          image_position: settings.imagePosition,
          image_size: settings.imageSize
        }, { onConflict: 'section_name' });
      
      if (error) throw error;
      showNotification('success', `Layout saved for ${section}`);
    } catch (error) {
      console.error('Error saving layout:', error);
      showNotification('error', 'Failed to save layout');
    }
  };

  // Fetch layout settings on mount
  useEffect(() => {
    const fetchLayouts = async () => {
      const { data } = await supabase.from('section_layouts').select('*');
      if (data) {
        const layouts: Record<string, LayoutSettings> = {};
        data.forEach(row => {
          layouts[row.section_name] = {
            layout: row.layout as LayoutSettings['layout'],
            cardDirection: row.card_direction as LayoutSettings['cardDirection'],
            gap: row.gap as LayoutSettings['gap'],
            showImage: row.show_image,
            imagePosition: row.image_position as LayoutSettings['imagePosition'],
            imageSize: row.image_size as LayoutSettings['imageSize']
          };
        });
        setSectionLayouts(prev => ({ ...prev, ...layouts }));
      }
    };
    fetchLayouts();
  }, []);

  // Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch all data
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        heroRes, heroImagesRes, aboutRes, communityRes, communityEventsRes, projectsRes, leadershipRes,
        awardsRes, specialAwardsRes, pressRes, publicationsRes, endorsementsRes, newsletterRes, subscribersRes
      ] = await Promise.all([
        supabase.from('hero_content').select('*').single(),
        supabase.from('hero_images').select('*').order('order_index'),
        supabase.from('about_content').select('*').single(),
        supabase.from('community').select('*').single(),
        supabase.from('community_events').select('*').order('order_index'),
        supabase.from('projects').select('*').order('order_index'),
        supabase.from('leadership').select('*').order('order_index'),
        supabase.from('awards').select('*').order('order_index'),
        supabase.from('special_awards').select('*').order('order_index'),
        supabase.from('press').select('*').order('order_index'),
        supabase.from('publications').select('*').order('order_index'),
        supabase.from('endorsements').select('*').order('order_index'),
        supabase.from('newsletter_issues').select('*').order('order_index'),
        supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }),
      ]);

      if (heroRes.data) setHeroContent(heroRes.data);
      if (heroImagesRes.data) setHeroImages(heroImagesRes.data);
      if (aboutRes.data) setAboutContent(aboutRes.data);
      if (communityRes.data) setCommunityContent(communityRes.data);
      if (communityEventsRes.data) setCommunityEvents(communityEventsRes.data);
      if (footerRes.data) setFooter(footerRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (leadershipRes.data) setLeadership(leadershipRes.data);
      if (awardsRes.data) setAwards(awardsRes.data);
      if (specialAwardsRes.data) setSpecialAwards(specialAwardsRes.data);
      if (pressRes.data) setPress(pressRes.data);
      if (publicationsRes.data) setPublications(publicationsRes.data);
      if (endorsementsRes.data) setEndorsements(endorsementsRes.data);
      if (newsletterRes.data) setNewsletterIssues(newsletterRes.data);
      if (subscribersRes.data) setNewsletterSubscribers(subscribersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Save functions
  const saveHeroContent = async () => {
    if (!heroContent) return;
    setSaving(true);
    const { error } = await supabase.from('hero_content').upsert({ ...heroContent, id: 1 });
    if (error) showNotification('error', 'Failed to save hero content');
    else showNotification('success', 'Hero content saved!');
    setSaving(false);
  };

  // Hero Images CRUD
  const addHeroImage = () => {
    setHeroImages([...heroImages, {
      image_url: '',
      alt_text: '',
      brightness: 80,
      order_index: heroImages.length,
      is_active: true
    }]);
  };

  const updateHeroImage = (index: number, updates: Partial<HeroImage>) => {
    const updated = [...heroImages];
    updated[index] = { ...updated[index], ...updates };
    setHeroImages(updated);
  };

  const deleteHeroImage = async (index: number) => {
    const image = heroImages[index];
    if (image.id) {
      await supabase.from('hero_images').delete().eq('id', image.id);
    }
    setHeroImages(heroImages.filter((_, i) => i !== index));
    showNotification('success', 'Image deleted');
  };

  const saveHeroImages = async () => {
    setSaving(true);
    for (let i = 0; i < heroImages.length; i++) {
      const image = { ...heroImages[i], order_index: i };
      if (image.id) {
        await supabase.from('hero_images').update(image).eq('id', image.id);
      } else {
        const { data } = await supabase.from('hero_images').insert(image).select().single();
        if (data) heroImages[i] = data;
      }
    }
    setHeroImages([...heroImages]);
    showNotification('success', 'Hero images saved!');
    setSaving(false);
  };

  const uploadHeroImage = async (file: File, index: number) => {
    const url = await uploadImage(file, 'portfolio-images', 'hero');
    if (url) {
      updateHeroImage(index, { image_url: url });
      showNotification('success', 'Image uploaded!');
    } else {
      showNotification('error', 'Failed to upload image');
    }
  };

  const saveAboutContent = async () => {
    if (!aboutContent) return;
    setSaving(true);
    const { error } = await supabase.from('about_content').upsert({ ...aboutContent, id: 1 });
    if (error) showNotification('error', 'Failed to save about content');
    else showNotification('success', 'About content saved!');
    setSaving(false);
  };

  const saveCommunityContent = async () => {
    if (!communityContent) return;
    setSaving(true);
    const { error } = await supabase.from('community').upsert({ ...communityContent, id: 1 });
    if (error) showNotification('error', 'Failed to save community content');
    else showNotification('success', 'Community content saved!');
    setSaving(false);
  };

  const saveFooter = async () => {
    if (!footer) return;
    setSaving(true);
    const { error } = await supabase.from('footer').upsert({ ...footer, id: 1 });
    if (error) showNotification('error', 'Failed to save footer');
    else showNotification('success', 'Footer saved!');
    setSaving(false);
  };

  // CRUD for Projects
  const addProject = () => {
    setProjects([...projects, {
      title: 'New Project',
      subtitle: 'Project Subtitle',
      description: 'Project description...',
      image_url: '',
      tags: [],
      awards: [],
      funding: null,
      status: 'Active',
      color: 'blue',
      order_index: projects.length
    }]);
  };

  const updateProject = (index: number, updates: Partial<Project>) => {
    setProjects(projects.map((p, i) => i === index ? { ...p, ...updates } : p));
  };

  const deleteProject = async (index: number) => {
    const project = projects[index];
    if (project.id) {
      await supabase.from('projects').delete().eq('id', project.id);
    }
    setProjects(projects.filter((_, i) => i !== index));
    showNotification('success', 'Project deleted');
  };

  const saveProjects = async () => {
    setSaving(true);
    for (let i = 0; i < projects.length; i++) {
      const project = { ...projects[i], order_index: i };
      if (project.id) {
        await supabase.from('projects').update(project).eq('id', project.id);
      } else {
        const { data } = await supabase.from('projects').insert(project).select().single();
        if (data) projects[i] = data;
      }
    }
    setProjects([...projects]);
    showNotification('success', 'Projects saved!');
    setSaving(false);
  };

  // CRUD for Leadership
  const addLeadership = () => {
    setLeadership([...leadership, {
      title: 'New Position',
      date: '2025',
      role: 'Role',
      organization: 'Organization',
      icon: 'Crown',
      color: 'violet',
      order_index: leadership.length
    }]);
  };

  const updateLeadership = (index: number, updates: Partial<Leadership>) => {
    setLeadership(leadership.map((l, i) => i === index ? { ...l, ...updates } : l));
  };

  const deleteLeadership = async (index: number) => {
    const item = leadership[index];
    if (item.id) {
      await supabase.from('leadership').delete().eq('id', item.id);
    }
    setLeadership(leadership.filter((_, i) => i !== index));
    showNotification('success', 'Leadership position deleted');
  };

  const saveLeadership = async () => {
    setSaving(true);
    for (let i = 0; i < leadership.length; i++) {
      const item = { ...leadership[i], order_index: i };
      if (item.id) {
        await supabase.from('leadership').update(item).eq('id', item.id);
      } else {
        const { data } = await supabase.from('leadership').insert(item).select().single();
        if (data) leadership[i] = data;
      }
    }
    setLeadership([...leadership]);
    showNotification('success', 'Leadership saved!');
    setSaving(false);
  };

  // CRUD for Awards
  const addAward = () => {
    setAwards([...awards, {
      title: 'New Award',
      description: 'Award description',
      is_featured: false,
      order_index: awards.length
    }]);
  };

  const updateAward = (index: number, updates: Partial<AwardItem>) => {
    setAwards(awards.map((a, i) => i === index ? { ...a, ...updates } : a));
  };

  const deleteAward = async (index: number) => {
    const item = awards[index];
    if (item.id) {
      await supabase.from('awards').delete().eq('id', item.id);
    }
    setAwards(awards.filter((_, i) => i !== index));
    showNotification('success', 'Award deleted');
  };

  const saveAwards = async () => {
    setSaving(true);
    for (let i = 0; i < awards.length; i++) {
      const item = { ...awards[i], order_index: i };
      if (item.id) {
        await supabase.from('awards').update(item).eq('id', item.id);
      } else {
        const { data } = await supabase.from('awards').insert(item).select().single();
        if (data) awards[i] = data;
      }
    }
    setAwards([...awards]);
    showNotification('success', 'Awards saved!');
    setSaving(false);
  };

  // CRUD for Special Awards
  const addSpecialAward = () => {
    setSpecialAwards([...specialAwards, { name: 'New Award', order_index: specialAwards.length }]);
  };

  const deleteSpecialAward = async (index: number) => {
    const item = specialAwards[index];
    if (item.id) {
      await supabase.from('special_awards').delete().eq('id', item.id);
    }
    setSpecialAwards(specialAwards.filter((_, i) => i !== index));
  };

  const saveSpecialAwards = async () => {
    setSaving(true);
    for (let i = 0; i < specialAwards.length; i++) {
      const item = { ...specialAwards[i], order_index: i };
      if (item.id) {
        await supabase.from('special_awards').update(item).eq('id', item.id);
      } else {
        const { data } = await supabase.from('special_awards').insert(item).select().single();
        if (data) specialAwards[i] = data;
      }
    }
    setSpecialAwards([...specialAwards]);
    showNotification('success', 'Special awards saved!');
    setSaving(false);
  };

  // CRUD for Press
  const addPress = () => {
    setPress([...press, {
      title: 'New Press Item',
      description: 'Description',
      source: 'Source',
      link: null,
      is_featured: false,
      is_video: false,
      color: 'red',
      order_index: press.length
    }]);
  };

  const updatePress = (index: number, updates: Partial<Press>) => {
    setPress(press.map((p, i) => i === index ? { ...p, ...updates } : p));
  };

  const deletePress = async (index: number) => {
    const item = press[index];
    if (item.id) {
      await supabase.from('press').delete().eq('id', item.id);
    }
    setPress(press.filter((_, i) => i !== index));
    showNotification('success', 'Press item deleted');
  };

  const savePress = async () => {
    setSaving(true);
    for (let i = 0; i < press.length; i++) {
      const item = { ...press[i], order_index: i };
      if (item.id) {
        await supabase.from('press').update(item).eq('id', item.id);
      } else {
        const { data } = await supabase.from('press').insert(item).select().single();
        if (data) press[i] = data;
      }
    }
    setPress([...press]);
    showNotification('success', 'Press saved!');
    setSaving(false);
  };

  // CRUD for Publications
  const addPublication = () => {
    setPublications([...publications, {
      title: 'New Publication',
      description: 'Description',
      platform: 'MEDIUM',
      link: '#',
      order_index: publications.length
    }]);
  };

  const updatePublication = (index: number, updates: Partial<Publication>) => {
    setPublications(publications.map((p, i) => i === index ? { ...p, ...updates } : p));
  };

  const deletePublication = async (index: number) => {
    const item = publications[index];
    if (item.id) {
      await supabase.from('publications').delete().eq('id', item.id);
    }
    setPublications(publications.filter((_, i) => i !== index));
    showNotification('success', 'Publication deleted');
  };

  const savePublications = async () => {
    setSaving(true);
    for (let i = 0; i < publications.length; i++) {
      const item = { ...publications[i], order_index: i };
      if (item.id) {
        await supabase.from('publications').update(item).eq('id', item.id);
      } else {
        const { data } = await supabase.from('publications').insert(item).select().single();
        if (data) publications[i] = data;
      }
    }
    setPublications([...publications]);
    showNotification('success', 'Publications saved!');
    setSaving(false);
  };

  // CRUD for Endorsements
  const addEndorsement = () => {
    setEndorsements([...endorsements, {
      name: 'New Endorser',
      role: 'Role',
      initial: 'N',
      quote: 'Quote text',
      color: 'pink',
      order_index: endorsements.length
    }]);
  };

  const updateEndorsement = (index: number, updates: Partial<Endorsement>) => {
    setEndorsements(endorsements.map((e, i) => i === index ? { ...e, ...updates } : e));
  };

  const deleteEndorsement = async (index: number) => {
    const item = endorsements[index];
    if (item.id) {
      await supabase.from('endorsements').delete().eq('id', item.id);
    }
    setEndorsements(endorsements.filter((_, i) => i !== index));
    showNotification('success', 'Endorsement deleted');
  };

  const saveEndorsements = async () => {
    setSaving(true);
    for (let i = 0; i < endorsements.length; i++) {
      const item = { ...endorsements[i], order_index: i };
      if (item.id) {
        await supabase.from('endorsements').update(item).eq('id', item.id);
      } else {
        const { data } = await supabase.from('endorsements').insert(item).select().single();
        if (data) endorsements[i] = data;
      }
    }
    setEndorsements([...endorsements]);
    showNotification('success', 'Endorsements saved!');
    setSaving(false);
  };

  // CRUD for Community Events
  const addCommunityEvent = () => {
    setCommunityEvents([...communityEvents, {
      title: 'New Event',
      description: '',
      link: '#',
      month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      order_index: communityEvents.length
    }]);
  };

  const deleteCommunityEvent = async (index: number) => {
    const item = communityEvents[index];
    if (item.id) {
      await supabase.from('community_events').delete().eq('id', item.id);
    }
    setCommunityEvents(communityEvents.filter((_, i) => i !== index));
  };

  const saveCommunityEvents = async () => {
    setSaving(true);
    for (let i = 0; i < communityEvents.length; i++) {
      const item = { ...communityEvents[i], order_index: i };
      if (item.id) {
        await supabase.from('community_events').update(item).eq('id', item.id);
      } else {
        const { data } = await supabase.from('community_events').insert(item).select().single();
        if (data) communityEvents[i] = data;
      }
    }
    setCommunityEvents([...communityEvents]);
    showNotification('success', 'Community events saved!');
    setSaving(false);
  };

  // CRUD for Newsletter
  const addNewsletterIssue = () => {
    setNewsletterIssues([...newsletterIssues, {
      title: 'New Issue',
      link: '#',
      month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      order_index: newsletterIssues.length
    }]);
  };

  const deleteNewsletterIssue = async (index: number) => {
    const item = newsletterIssues[index];
    if (item.id) {
      await supabase.from('newsletter_issues').delete().eq('id', item.id);
    }
    setNewsletterIssues(newsletterIssues.filter((_, i) => i !== index));
  };

  const saveNewsletterIssues = async () => {
    setSaving(true);
    for (let i = 0; i < newsletterIssues.length; i++) {
      const item = { ...newsletterIssues[i], order_index: i };
      if (item.id) {
        await supabase.from('newsletter_issues').update(item).eq('id', item.id);
      } else {
        const { data } = await supabase.from('newsletter_issues').insert(item).select().single();
        if (data) newsletterIssues[i] = data;
      }
    }
    setNewsletterIssues([...newsletterIssues]);
    showNotification('success', 'Newsletter issues saved!');
    setSaving(false);
  };

  // Newsletter Subscribers Management
  const toggleSubscriberStatus = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: !currentStatus })
      .eq('id', id);
    
    if (!error) {
      setNewsletterSubscribers(newsletterSubscribers.map(s => 
        s.id === id ? { ...s, is_active: !currentStatus } : s
      ));
      showNotification('success', `Subscriber ${!currentStatus ? 'activated' : 'deactivated'}`);
    } else {
      showNotification('error', 'Failed to update subscriber status');
    }
  };

  const deleteSubscriber = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setNewsletterSubscribers(newsletterSubscribers.filter(s => s.id !== id));
      showNotification('success', 'Subscriber deleted');
    } else {
      showNotification('error', 'Failed to delete subscriber');
    }
  };

  const exportSubscribers = () => {
    const activeSubscribers = newsletterSubscribers.filter(s => s.is_active);
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Subscribed At,Status,Name,Notes\n"
      + activeSubscribers.map(s => 
          `${s.email},${new Date(s.subscribed_at).toLocaleDateString()},${s.is_active ? 'Active' : 'Inactive'},${s.name || ''},${s.notes || ''}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
            <p className="text-slate-500 mt-1">Sign in to manage your portfolio</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          </form>
          
          <p className="text-center text-sm text-slate-500 mt-6">
            Create an account in Supabase Dashboard → Authentication
          </p>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${
          notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">Portfolio Admin</h1>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="px-4 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium">
              View Site →
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        
        {/* Hero Section */}
        <SectionWrapper 
          title="Hero Section" 
          icon={Home} 
          isOpen={openSections.hero} 
          onToggle={() => toggleSection('hero')}
          previewContent={heroContent && (
            <div className="bg-[#000205] text-white p-8 rounded-xl relative overflow-hidden min-h-[600px]">
              {/* Simplified particle background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute w-32 h-32 bg-violet-600 rounded-full blur-3xl top-10 left-10"></div>
                <div className="absolute w-40 h-40 bg-indigo-600 rounded-full blur-3xl bottom-20 right-20"></div>
              </div>
              <div className="relative z-10 text-center space-y-6">
                {/* Badge and Subtitle */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600/80 rounded-full">
                    <Trophy className="w-4 h-4 text-yellow-200" />
                    <span className="text-yellow-100 text-sm font-bold">{heroContent.badge_text}</span>
                  </div>
                  <p className="text-slate-400 text-xs tracking-widest uppercase">{heroContent.subtitle}</p>
                </div>
                
                {/* Image Frame Preview */}
                {heroImages.filter(img => img.is_active && img.image_url).length > 0 && (
                  <div className={`mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/20 ${
                    heroFrameSize === 'small' ? 'w-48 h-48' : 
                    heroFrameSize === 'large' ? 'w-96 h-80' : 
                    'w-64 h-64'
                  }`}>
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${heroImages.find(img => img.is_active && img.image_url)?.image_url})` }}
                    />
                  </div>
                )}
                
                {/* Name */}
                <h1 className="text-4xl font-black">{heroContent.name}</h1>
                
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-700">
                  <div><div className="text-xl font-bold">{heroContent.stat_1_value}</div><div className="text-xs text-slate-400">{heroContent.stat_1_label}</div></div>
                  <div><div className="text-xl font-bold">{heroContent.stat_2_value}</div><div className="text-xs text-slate-400">{heroContent.stat_2_label}</div></div>
                  <div><div className="text-xl font-bold">{heroContent.stat_3_value}</div><div className="text-xs text-slate-400">{heroContent.stat_3_label}</div></div>
                  <div><div className="text-xl font-bold">{heroContent.stat_4_value}</div><div className="text-xs text-slate-400">{heroContent.stat_4_label}</div></div>
                </div>
              </div>
            </div>
          )}
        >
          {heroContent && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={heroContent.badge_text}
                    onChange={(e) => setHeroContent({ ...heroContent, badge_text: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={heroContent.subtitle}
                    onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={heroContent.name}
                  onChange={(e) => setHeroContent({ ...heroContent, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-2xl font-bold"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="space-y-2">
                    <input
                      type="text"
                      value={(heroContent as any)[`stat_${n}_value`]}
                      onChange={(e) => setHeroContent({ ...heroContent, [`stat_${n}_value`]: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-bold"
                      placeholder="Value"
                    />
                    <input
                      type="text"
                      value={(heroContent as any)[`stat_${n}_label`]}
                      onChange={(e) => setHeroContent({ ...heroContent, [`stat_${n}_label`]: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Label"
                    />
                  </div>
                ))}
              </div>
              <button onClick={saveHeroContent} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                <Save className="w-4 h-4" /> Save Hero
              </button>
            </div>
          )}

          {/* Hero Images Management */}
          <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-700">Hero Images</h3>
                <p className="text-sm text-slate-500">Upload and manage images for the hero slideshow</p>
              </div>
              <button onClick={addHeroImage} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                <Plus className="w-4 h-4" /> Add Image
              </button>
            </div>

            {/* Frame Size Control */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">Image Frame Size</label>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setHeroFrameSize(size)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      heroFrameSize === size
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Images List */}
            {heroImages.length === 0 ? (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No images yet. Click "Add Image" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {heroImages.map((image, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex gap-4">
                      {/* Image Preview */}
                      <div className="flex-shrink-0">
                        {image.image_url ? (
                          <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                            <img src={image.image_url} alt={image.alt_text} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50">
                            <Upload className="w-6 h-6 text-slate-400" />
                          </div>
                        )}
                      </div>

                      {/* Image Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-600">Image {index + 1}</span>
                        </div>
                        
                        {/* Upload Button */}
                        <ImageUploader
                          currentUrl={image.image_url}
                          onUpload={(url) => updateHeroImage(index, { image_url: url })}
                          label=""
                        />

                        {/* Alt Text */}
                        <input
                          type="text"
                          value={image.alt_text}
                          onChange={(e) => updateHeroImage(index, { alt_text: e.target.value })}
                          placeholder="Alt text (optional)"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                        />

                        {/* Brightness Control */}
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">
                            Brightness: {image.brightness}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={image.brightness}
                            onChange={(e) => updateHeroImage(index, { brightness: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>

                        {/* Active Toggle */}
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={image.is_active}
                            onChange={(e) => updateHeroImage(index, { is_active: e.target.checked })}
                            className="rounded"
                          />
                          <span className="text-slate-600">Active (show in slideshow)</span>
                        </label>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteHeroImage(index)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Save Button */}
            {heroImages.length > 0 && (
              <button
                onClick={saveHeroImages}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Save All Images
              </button>
            )}
          </div>
        </SectionWrapper>

        {/* About Section */}
        <SectionWrapper 
          title="About Me" 
          icon={User} 
          isOpen={openSections.about} 
          onToggle={() => toggleSection('about')}
          previewContent={aboutContent && (
            <div className="space-y-4">
              <div className="mb-6 border-l-4 border-slate-400 pl-4">
                <span className="text-slate-500 font-bold tracking-widest uppercase text-sm">Chapter 01</span>
                <h2 className="text-3xl font-black text-black">About Me</h2>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl grid md:grid-cols-5 gap-6">
                <div className="md:col-span-3 space-y-4">
                  <p className="text-slate-700 leading-relaxed text-lg italic">{aboutContent.paragraph_1}</p>
                  <p className="text-slate-700 leading-relaxed text-lg italic">{aboutContent.paragraph_2}</p>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {aboutContent.tags?.map((tag, i) => (
                      <span key={i} className="px-4 py-2 bg-white text-slate-600 rounded-full text-sm border border-slate-200">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 h-64 rounded-2xl overflow-hidden bg-slate-200">
                  {aboutContent.image_url && <img src={aboutContent.image_url} className="w-full h-full object-cover" alt="Profile" />}
                </div>
              </div>
            </div>
          )}
        >
          {aboutContent && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Paragraph 1</label>
                <textarea
                  value={aboutContent.paragraph_1}
                  onChange={(e) => setAboutContent({ ...aboutContent, paragraph_1: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Paragraph 2</label>
                <textarea
                  value={aboutContent.paragraph_2}
                  onChange={(e) => setAboutContent({ ...aboutContent, paragraph_2: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <ImageUploader
                currentUrl={aboutContent.image_url}
                onUpload={(url) => setAboutContent({ ...aboutContent, image_url: url })}
                label="Profile Image"
              />
              <TagInput
                tags={aboutContent.tags}
                onChange={(tags) => setAboutContent({ ...aboutContent, tags })}
                label="Tags/Skills"
              />
              <button onClick={saveAboutContent} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                <Save className="w-4 h-4" /> Save About
              </button>
            </div>
          )}
        </SectionWrapper>

        {/* Leadership Section */}
        <SectionWrapper 
          title="Experience / Leadership" 
          icon={Briefcase} 
          isOpen={openSections.leadership} 
          onToggle={() => toggleSection('leadership')}
          previewContent={
            <div className="space-y-4">
              <div className="mb-6 border-l-4 border-violet-500 pl-4">
                <span className="text-violet-600 font-bold tracking-widest uppercase text-sm">Chapter 02</span>
                <h2 className="text-3xl font-black text-black">Experience / Leadership</h2>
              </div>
              <LayoutEditor 
                settings={sectionLayouts.leadership} 
                onChange={(s) => updateSectionLayout('leadership', s)}
                showImageOptions={false}
                onSave={() => saveLayoutSettings('leadership')}
                sectionName="leadership"
              />
              <div className={`${
                sectionLayouts.leadership.layout === 'list' ? 'space-y-4' : 
                sectionLayouts.leadership.layout === 'grid-2' ? 'grid grid-cols-2 gap-4' : 
                sectionLayouts.leadership.layout === 'grid-3' ? 'grid grid-cols-3 gap-4' : 
                'grid grid-cols-4 gap-4'
              }`}>
                {leadership.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`bg-white shadow-lg p-6 rounded-xl border border-violet-100 ${
                      sectionLayouts.leadership.cardDirection === 'horizontal' ? 'flex items-center gap-4' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                        <span className="text-xs font-mono text-violet-600 bg-violet-50 px-2 py-1 rounded">{item.date}</span>
                      </div>
                      <p className="text-slate-600 text-sm mb-2">{item.role}</p>
                      <div className="text-xs text-violet-500 font-mono">{item.organization}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            {leadership.map((item, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                    <span className="text-xs font-mono text-slate-500">#{index + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setPreviewItem(previewItem === index ? null : index)}
                      className={`p-1 rounded ${previewItem === index ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {previewItem === index ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => deleteLeadership(index)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Live Preview */}
                {previewItem === index && (
                  <div className="p-4 bg-white rounded-lg border border-indigo-200 mb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-bold text-indigo-600">Live Preview</span>
                    </div>
                    <PreviewPanel item={item} type="leadership" />
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateLeadership(index, { title: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={item.date}
                    onChange={(e) => updateLeadership(index, { date: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Date"
                  />
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => updateLeadership(index, { role: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Role"
                  />
                  <input
                    type="text"
                    value={item.organization}
                    onChange={(e) => updateLeadership(index, { organization: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Organization"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <IconSelect value={item.icon} onChange={(icon) => updateLeadership(index, { icon })} label="Icon" />
                  <ColorSelect value={item.color} onChange={(color) => updateLeadership(index, { color })} label="Color" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">🔗</span>
                  <input
                    type="url"
                    value={item.link || ''}
                    onChange={(e) => updateLeadership(index, { link: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    placeholder="Optional: Link URL (opens when card is clicked)"
                  />
                </div>
              </div>
            ))}
            <div className="flex gap-3">
              <button onClick={addLeadership} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                <Plus className="w-4 h-4" /> Add Position
              </button>
              <button onClick={saveLeadership} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                <Save className="w-4 h-4" /> Save All
              </button>
            </div>
          </div>
        </SectionWrapper>

        {/* Projects Section */}
        <SectionWrapper 
          title="Portfolio Projects" 
          icon={FolderOpen} 
          isOpen={openSections.projects} 
          onToggle={() => toggleSection('projects')}
          previewContent={
            <div className="space-y-4">
              <div className="mb-6 border-l-4 border-blue-500 pl-4">
                <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Chapter 03</span>
                <h2 className="text-3xl font-black text-black">Portfolio Projects</h2>
              </div>
              <LayoutEditor 
                settings={sectionLayouts.projects} 
                onChange={(s) => updateSectionLayout('projects', s)}
                showImageOptions={true}
                onSave={() => saveLayoutSettings('projects')}
                sectionName="projects"
              />
              <div className={`${
                sectionLayouts.projects.layout === 'list' ? 'space-y-4' : 
                sectionLayouts.projects.layout === 'grid-2' ? 'grid grid-cols-2 gap-4' : 
                sectionLayouts.projects.layout === 'grid-3' ? 'grid grid-cols-3 gap-4' : 
                'grid grid-cols-4 gap-4'
              }`}>
                {projects.map((p, idx) => {
                  const imgPos = sectionLayouts.projects.imagePosition;
                  const imgSize = sectionLayouts.projects.imageSize;
                  const isHorizontal = sectionLayouts.projects.cardDirection === 'horizontal' || imgPos === 'left' || imgPos === 'right';
                  const showImg = sectionLayouts.projects.showImage && p.image_url;
                  
                  // Image size classes
                  const imgSizeClass = imgSize === 'sm' ? (isHorizontal ? 'w-20' : 'h-20') :
                                       imgSize === 'lg' ? (isHorizontal ? 'w-48' : 'h-48') :
                                       imgSize === 'full' ? (isHorizontal ? 'w-1/2' : 'h-64') :
                                       (isHorizontal ? 'w-32' : 'h-32'); // md default
                  
                  return (
                    <div 
                      key={idx} 
                      className={`bg-white shadow-lg rounded-xl border border-blue-100 overflow-hidden relative ${
                        isHorizontal ? 'flex' : ''
                      } ${imgPos === 'right' ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Background image */}
                      {showImg && imgPos === 'background' && (
                        <div className="absolute inset-0 z-0">
                          <img src={p.image_url} className="w-full h-full object-cover opacity-30" alt={p.title} />
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                        </div>
                      )}
                      
                      {/* Regular image (top, left, right) */}
                      {showImg && imgPos !== 'background' && (
                        <div className={`bg-slate-200 flex-shrink-0 ${imgSizeClass} ${!isHorizontal ? 'w-full' : ''}`}>
                          <img src={p.image_url} className="w-full h-full object-cover" alt={p.title} />
                        </div>
                      )}
                      
                      <div className="p-4 relative z-10 flex-1">
                        <h3 className="font-bold text-slate-900">{p.title}</h3>
                        <p className="text-sm text-blue-600">{p.subtitle}</p>
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2">{p.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                  <button onClick={() => deleteProject(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => updateProject(index, { title: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg font-bold"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={project.subtitle}
                    onChange={(e) => updateProject(index, { subtitle: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Subtitle"
                  />
                </div>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(index, { description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Description"
                />
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={project.funding || ''}
                    onChange={(e) => updateProject(index, { funding: e.target.value || null })}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Funding (e.g., $15,000)"
                  />
                  <input
                    type="text"
                    value={project.status}
                    onChange={(e) => updateProject(index, { status: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Status"
                  />
                </div>
                <ImageUploader
                  currentUrl={project.image_url}
                  onUpload={(url) => updateProject(index, { image_url: url })}
                  label="Project Image"
                />
                <TagInput
                  tags={project.tags}
                  onChange={(tags) => updateProject(index, { tags })}
                  label="Tech Tags"
                />
                <TagInput
                  tags={project.awards}
                  onChange={(awards) => updateProject(index, { awards })}
                  label="Awards"
                />
                <ColorSelect value={project.color} onChange={(color) => updateProject(index, { color })} label="Accent Color" />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-500">🔗</span>
                  <input
                    type="url"
                    value={project.link || ''}
                    onChange={(e) => updateProject(index, { link: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    placeholder="Optional: Project Link URL (opens when card is clicked)"
                  />
                </div>
              </div>
            ))}
            <div className="flex gap-3">
              <button onClick={addProject} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                <Plus className="w-4 h-4" /> Add Project
              </button>
              <button onClick={saveProjects} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                <Save className="w-4 h-4" /> Save All
              </button>
            </div>
          </div>
        </SectionWrapper>

        {/* Awards Section */}
        <SectionWrapper 
          title="Awards & Recognition" 
          icon={Award} 
          isOpen={openSections.awards} 
          onToggle={() => toggleSection('awards')}
          previewContent={
            <div className="space-y-4">
              <div className="mb-6 border-l-4 border-yellow-500 pl-4">
                <span className="text-yellow-600 font-bold tracking-widest uppercase text-sm">Chapter 04</span>
                <h2 className="text-3xl font-black text-black">Awards & Recognition</h2>
              </div>
              <LayoutEditor 
                settings={sectionLayouts.awards} 
                onChange={(s) => updateSectionLayout('awards', s)}
                showImageOptions={false}
                onSave={() => saveLayoutSettings('awards')}
                sectionName="awards"
              />
              <div className={`${
                sectionLayouts.awards.layout === 'list' ? 'space-y-4' : 
                sectionLayouts.awards.layout === 'grid-2' ? 'grid grid-cols-2 gap-4' : 
                sectionLayouts.awards.layout === 'grid-3' ? 'grid grid-cols-3 gap-4' : 
                'grid grid-cols-4 gap-4'
              }`}>
                {awards.filter(a => a.is_featured).map((award, idx) => (
                  <div 
                    key={idx} 
                    className={`p-6 bg-white shadow-lg border border-yellow-200 rounded-xl ${
                      sectionLayouts.awards.cardDirection === 'horizontal' ? 'flex items-center gap-4' : ''
                    }`}
                  >
                    <Award className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{award.title}</h3>
                      <p className="text-yellow-600 text-sm font-bold">{award.description}</p>
                    </div>
                  </div>
                ))}
                {awards.filter(a => !a.is_featured).map((award, idx) => (
                  <div 
                    key={idx} 
                    className={`p-6 bg-white shadow-md border border-yellow-100 rounded-xl ${
                      sectionLayouts.awards.cardDirection === 'horizontal' ? 'flex items-center gap-4' : ''
                    }`}
                  >
                    <h3 className="font-bold text-slate-900 mb-1">{award.title}</h3>
                    <p className="text-sm text-yellow-700">{award.description}</p>
                  </div>
                ))}
              </div>
              {specialAwards.length > 0 && (
                <div className="p-6 bg-white shadow-md border border-slate-200 rounded-xl mt-4">
                  <h3 className="font-bold text-slate-900 mb-4 text-lg">Special Awards</h3>
                  <div className="flex flex-wrap gap-3">
                    {specialAwards.map((award, idx) => (
                      <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-full text-sm font-medium border border-slate-200">{award.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          }
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-700">Main Awards</h3>
              {awards.map((award, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <GripVertical className="w-5 h-5 text-slate-400 cursor-move mt-2" />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={award.title}
                      onChange={(e) => updateAward(index, { title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                      placeholder="Award Title"
                    />
                    <input
                      type="text"
                      value={award.description}
                      onChange={(e) => updateAward(index, { description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      placeholder="Description"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={award.is_featured}
                        onChange={(e) => updateAward(index, { is_featured: e.target.checked })}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-600">Featured (larger card)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">🔗</span>
                      <input
                        type="url"
                        value={award.link || ''}
                        onChange={(e) => updateAward(index, { link: e.target.value })}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        placeholder="Optional: Link URL"
                      />
                    </div>
                  </div>
                  <button onClick={() => deleteAward(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-3">
                <button onClick={addAward} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                  <Plus className="w-4 h-4" /> Add Award
                </button>
                <button onClick={saveAwards} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  <Save className="w-4 h-4" /> Save Awards
                </button>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-3">
              <h3 className="font-bold text-slate-700">Special Awards (Tags)</h3>
              <div className="flex flex-wrap gap-2">
                {specialAwards.map((award, index) => (
                  <div key={index} className="p-3 bg-slate-100 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={award.name}
                        onChange={(e) => {
                          const updated = [...specialAwards];
                          updated[index] = { ...award, name: e.target.value };
                          setSpecialAwards(updated);
                        }}
                        className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-sm"
                        placeholder="Award Name"
                      />
                      <button onClick={() => deleteSpecialAward(index)} className="text-slate-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">🔗</span>
                      <input
                        type="url"
                        value={award.link || ''}
                        onChange={(e) => {
                          const updated = [...specialAwards];
                          updated[index] = { ...award, link: e.target.value };
                          setSpecialAwards(updated);
                        }}
                        className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                        placeholder="Optional: Link URL"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={addSpecialAward} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                  <Plus className="w-4 h-4" /> Add Special Award
                </button>
                <button onClick={saveSpecialAwards} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Community Section */}
        <SectionWrapper 
          title="Community & Service" 
          icon={Users} 
          isOpen={openSections.community} 
          onToggle={() => toggleSection('community')}
          previewContent={
            <div className="space-y-4">
              <div className="mb-6 border-l-4 border-emerald-500 pl-4">
                <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">Chapter 05</span>
                <h2 className="text-3xl font-black text-black">Community & Service</h2>
              </div>
              <div className="flex md:flex-row flex-col gap-1 items-start">
                {/* Left Column: Upcoming + Donate Stacked */}
                <div className="flex-1 space-y-6 max-w-sm">
                  {/* Upcoming Card - Top */}
                  <div className="w-full bg-white rounded-lg border border-emerald-100 hover:shadow-lg transition-all duration-300 p-8 min-h-[180px]">
                    <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-6">Upcoming</h4>
                    {communityEvents.length > 0 ? (
                      <a href={communityEvents[0].link || '#'} className="block group">
                        <div className="text-sm text-emerald-500 font-mono mb-4">{communityEvents[0].month || 'January 2026'}</div>
                        <h5 className="text-base text-slate-800 font-bold group-hover:text-emerald-700 transition-colors">{communityEvents[0].title}</h5>
                        {communityEvents[0].description && (
                          <p className="text-sm text-slate-600 mt-2">{communityEvents[0].description}</p>
                        )}
                      </a>
                    ) : (
                      <div className="text-base text-slate-600">No upcoming event</div>
                    )}
                  </div>

                  {/* Donate Card - Below Upcoming */}
                  <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden min-h-[280px]">
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-bold text-slate-900">{communityContent?.title || 'Silver AI Initiative'}</h3>
                      <p className="text-sm text-slate-600">{communityContent?.description || 'Bridging the generational gap. We conduct seminars, provide books, and training to educate seniors in the AI era.'}</p>
                      <a 
                        href={communityContent?.cta_link || '#'} 
                        className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        {communityContent?.cta_text || 'Donate via GoFundMe'} <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Past Events Card - Right */}
                <div className="flex-1 max-w-sm">
                  <div className="bg-white rounded-lg border border-emerald-100 hover:shadow-lg transition-all duration-300 p-8 min-h-[180px]">
                    <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-6">Past Events</h4>
                    {communityEvents.length > 1 ? (
                      <div className="space-y-5">
                        {communityEvents.slice(1).map((event) => (
                          <a key={event.id} href={event.link || '#'} className="block group">
                            <div className="text-sm text-emerald-500 font-mono mb-3">{event.month || ''}</div>
                            <h5 className="text-base text-slate-800 font-bold group-hover:text-emerald-700 transition-colors">{event.title}</h5>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-base text-slate-600">No past events yet</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Community Content */}
            {communityContent && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-700">Community Info</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={communityContent.title}
                    onChange={(e) => setCommunityContent({ ...communityContent, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={communityContent.description}
                    onChange={(e) => setCommunityContent({ ...communityContent, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={communityContent.cta_text}
                    onChange={(e) => setCommunityContent({ ...communityContent, cta_text: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CTA Link</label>
                  <input
                    type="text"
                    value={communityContent.cta_link}
                    onChange={(e) => setCommunityContent({ ...communityContent, cta_link: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <button onClick={saveCommunityContent} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                <Save className="w-4 h-4" /> Save Community Info
              </button>
            </div>
            )}

            {/* Community Events Section */}
            <div className="space-y-4">
              {/* Info Box */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  How Events are Displayed
                </h4>
                <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                  <li><strong>Upcoming Card:</strong> The first event (Event 1) will be displayed in the "Upcoming" card on the main website.</li>
                  <li><strong>Past Events Card:</strong> All other events (Event 2, Event 3, etc.) will be displayed in the "Past Events" card.</li>
                  <li>Drag events to reorder them - the first event in the list becomes the "Upcoming" event.</li>
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700">Community Events</h3>
                <span className="text-xs text-slate-500">Drag to reorder • First event = Upcoming, Rest = Past Events</span>
              </div>
              {communityEvents.map((item, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                      <span className="text-xs font-medium text-slate-500">Event {index + 1}</span>
                    </div>
                    {index === 0 ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">UPCOMING</span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-full">PAST EVENT</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={item.month || ''}
                    onChange={(e) => {
                      const updated = [...communityEvents];
                      updated[index] = { ...item, month: e.target.value };
                      setCommunityEvents(updated);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    placeholder="Month (e.g., January 2026)"
                  />
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...communityEvents];
                      updated[index] = { ...item, title: e.target.value };
                      setCommunityEvents(updated);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Event Title"
                  />
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => {
                      const updated = [...communityEvents];
                      updated[index] = { ...item, description: e.target.value };
                      setCommunityEvents(updated);
                    }}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    placeholder="Event Description (optional)"
                  />
                  <input
                    type="text"
                    value={item.link}
                    onChange={(e) => {
                      const updated = [...communityEvents];
                      updated[index] = { ...item, link: e.target.value };
                      setCommunityEvents(updated);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    placeholder="Link"
                  />
                  <button onClick={() => deleteCommunityEvent(index)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              ))}
              <div className="flex gap-3">
                <button onClick={addCommunityEvent} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                  <Plus className="w-4 h-4" /> Add Event
                </button>
                <button onClick={saveCommunityEvents} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  <Save className="w-4 h-4" /> Save All Events
                </button>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Press Section */}
        <SectionWrapper 
          title="Media & Press" 
          icon={Newspaper} 
          isOpen={openSections.press} 
          onToggle={() => toggleSection('press')}
          previewContent={
            <div className="space-y-4">
              <div className="mb-6 border-l-4 border-red-500 pl-4">
                <span className="text-red-600 font-bold tracking-widest uppercase text-sm">Chapter 07</span>
                <h2 className="text-3xl font-black text-black">Media & Press</h2>
              </div>
              <LayoutEditor 
                settings={sectionLayouts.press} 
                onChange={(s) => updateSectionLayout('press', s)}
                showImageOptions={false}
                onSave={() => saveLayoutSettings('press')}
                sectionName="press"
              />
              <div className={`${
                sectionLayouts.press.layout === 'list' ? 'space-y-4' : 
                sectionLayouts.press.layout === 'grid-2' ? 'grid grid-cols-2 gap-4' : 
                sectionLayouts.press.layout === 'grid-3' ? 'grid grid-cols-3 gap-4' : 
                'grid grid-cols-4 gap-4'
              }`}>
                {press.filter(p => p.is_featured).map((item, idx) => (
                  <div key={idx} className={`bg-red-50 border border-red-100 p-8 rounded-2xl ${
                    sectionLayouts.press.cardDirection === 'horizontal' ? 'flex items-start gap-4' : ''
                  }`}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="text-red-600 text-xs font-bold uppercase tracking-widest">{item.source}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                      <p className="text-slate-700 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
                {press.filter(p => !p.is_featured && !p.is_video).map((item, idx) => (
                  <div key={idx} className={`bg-white border border-slate-200 p-6 rounded-2xl ${
                    sectionLayouts.press.cardDirection === 'horizontal' ? 'flex items-center gap-4' : ''
                  }`}>
                    <div className="text-red-600 text-lg font-bold uppercase tracking-wide mb-3">{item.source}</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            {press.map((item, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                  <button onClick={() => deletePress(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updatePress(index, { title: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg font-bold"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={item.source}
                    onChange={(e) => updatePress(index, { source: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Source (e.g., CTV NEWS)"
                  />
                </div>
                <textarea
                  value={item.description}
                  onChange={(e) => updatePress(index, { description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Description"
                />
                <input
                  type="text"
                  value={item.link || ''}
                  onChange={(e) => updatePress(index, { link: e.target.value || null })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Link (optional)"
                />
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.is_featured}
                      onChange={(e) => updatePress(index, { is_featured: e.target.checked })}
                      className="rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-600">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.is_video}
                      onChange={(e) => updatePress(index, { is_video: e.target.checked })}
                      className="rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-600">Video</span>
                  </label>
                </div>
                <ColorSelect value={item.color} onChange={(color) => updatePress(index, { color })} label="Color" />
              </div>
            ))}
            <div className="flex gap-3">
              <button onClick={addPress} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                <Plus className="w-4 h-4" /> Add Press Item
              </button>
              <button onClick={savePress} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                <Save className="w-4 h-4" /> Save All
              </button>
            </div>
          </div>
        </SectionWrapper>

        {/* Publications Section */}
        <SectionWrapper 
          title="Publications" 
          icon={BookOpen} 
          isOpen={openSections.publications} 
          onToggle={() => toggleSection('publications')}
          previewContent={
            <div className="space-y-4">
              <div className="mb-6 border-l-4 border-purple-500 pl-4">
                <span className="text-purple-600 font-bold tracking-widest uppercase text-sm">Chapter 08</span>
                <h2 className="text-3xl font-black text-black">Publications</h2>
              </div>
              <LayoutEditor 
                settings={sectionLayouts.publications} 
                onChange={(s) => updateSectionLayout('publications', s)}
                showImageOptions={false}
                onSave={() => saveLayoutSettings('publications')}
                sectionName="publications"
              />
              <div className={`${
                sectionLayouts.publications.layout === 'list' ? 'space-y-4' : 
                sectionLayouts.publications.layout === 'grid-2' ? 'grid grid-cols-2 gap-4' : 
                sectionLayouts.publications.layout === 'grid-3' ? 'grid grid-cols-3 gap-4' : 
                'grid grid-cols-4 gap-4'
              }`}>
                {publications.map((pub, idx) => (
                  <div 
                    key={idx} 
                    className={`bg-white shadow-md rounded-xl border border-purple-100 p-4 ${
                      sectionLayouts.publications.cardDirection === 'horizontal' ? 'flex items-center gap-4' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{pub.title}</h4>
                      <p className="text-sm text-purple-600">{pub.publication_type}</p>
                      {pub.authors && <p className="text-xs text-slate-500 mt-1">{pub.authors}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            {publications.map((item, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                  <button onClick={() => deletePublication(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updatePublication(index, { title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  placeholder="Title"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => updatePublication(index, { description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Description"
                />
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={item.platform}
                    onChange={(e) => updatePublication(index, { platform: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Platform (e.g., MEDIUM)"
                  />
                  <input
                    type="text"
                    value={item.link}
                    onChange={(e) => updatePublication(index, { link: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Link"
                  />
                </div>
              </div>
            ))}
            <div className="flex gap-3">
              <button onClick={addPublication} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                <Plus className="w-4 h-4" /> Add Publication
              </button>
              <button onClick={savePublications} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                <Save className="w-4 h-4" /> Save All
              </button>
            </div>
          </div>
        </SectionWrapper>

        {/* Endorsements Section */}
        <SectionWrapper 
          title="Endorsements" 
          icon={Quote} 
          isOpen={openSections.endorsements} 
          onToggle={() => toggleSection('endorsements')}
          previewContent={
            <div className="space-y-4">
              <div className="mb-6 border-l-4 border-pink-500 pl-4">
                <span className="text-pink-600 font-bold tracking-widest uppercase text-sm">Chapter 08</span>
                <h2 className="text-3xl font-black text-black">Endorsements</h2>
              </div>
              <LayoutEditor 
                settings={sectionLayouts.endorsements} 
                onChange={(s) => updateSectionLayout('endorsements', s)}
                showImageOptions={false}
                onSave={() => saveLayoutSettings('endorsements')}
                sectionName="endorsements"
              />
              <div className={`${
                sectionLayouts.endorsements.layout === 'list' ? 'space-y-4' : 
                sectionLayouts.endorsements.layout === 'grid-2' ? 'grid grid-cols-2 gap-4' : 
                sectionLayouts.endorsements.layout === 'grid-3' ? 'grid grid-cols-3 gap-4' : 
                'grid grid-cols-4 gap-4'
              }`}>
                {endorsements.map((item, idx) => (
                  <div key={idx} className={`bg-white shadow-lg p-8 rounded-2xl border border-pink-100 ${
                    sectionLayouts.endorsements.cardDirection === 'horizontal' ? 'flex items-start gap-4' : ''
                  }`}>
                    <Quote className="text-pink-200 w-8 h-8 flex-shrink-0 mb-4" />
                    <div className="flex-1">
                      <p className="text-slate-700 italic mb-6 leading-relaxed">"{item.quote}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center font-bold text-pink-600 text-xs border border-pink-200">{item.initial}</div>
                        <div>
                          <div className="text-slate-900 font-bold text-sm">{item.name}</div>
                          <div className="text-pink-600 text-xs uppercase tracking-wide">{item.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            {endorsements.map((item, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                  <button onClick={() => deleteEndorsement(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateEndorsement(index, { name: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg font-bold"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => updateEndorsement(index, { role: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Role/Company"
                  />
                  <input
                    type="text"
                    value={item.initial}
                    onChange={(e) => updateEndorsement(index, { initial: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Initials"
                  />
                </div>
                <textarea
                  value={item.quote}
                  onChange={(e) => updateEndorsement(index, { quote: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Quote"
                />
                <div className="grid md:grid-cols-2 gap-3">
                  <ColorSelect value={item.color} onChange={(color) => updateEndorsement(index, { color })} label="Color" />
                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">Link (optional)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">🔗</span>
                      <input
                        type="url"
                        value={item.link || ''}
                        onChange={(e) => updateEndorsement(index, { link: e.target.value })}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        placeholder="Link URL"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex gap-3">
              <button onClick={addEndorsement} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                <Plus className="w-4 h-4" /> Add Endorsement
              </button>
              <button onClick={saveEndorsements} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                <Save className="w-4 h-4" /> Save All
              </button>
            </div>
          </div>
        </SectionWrapper>

        {/* Newsletter Section */}
        <SectionWrapper 
          title="Newsletter" 
          icon={Mail} 
          isOpen={openSections.newsletter} 
          onToggle={() => toggleSection('newsletter')}
          previewContent={
            <div className="space-y-4">
              <div className="mb-6 border-l-4 border-indigo-500 pl-4">
                <span className="text-indigo-600 font-bold tracking-widest uppercase text-sm">Chapter 09</span>
                <h2 className="text-3xl font-black text-black">Newsletter</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Stay Updated</h3>
                  <p className="text-slate-600 mb-4">Subscribe to my newsletter for latest updates on projects, research, and opportunities.</p>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="flex-1 px-4 py-3 rounded-full border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-full">Subscribe</button>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Past Issues</h4>
                  {newsletterIssues.slice(0, 3).map((issue, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                      <span className="text-xs text-indigo-500 font-mono">{issue.issue_number}</span>
                      <h5 className="font-medium text-slate-800 text-sm">{issue.title}</h5>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                How Issues are Displayed
              </h4>
              <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                <li><strong>Current Card:</strong> The first issue (Issue 1) will be displayed in the "Current" card on the main website.</li>
                <li><strong>Past Issues Card:</strong> All other issues (Issue 2, Issue 3, etc.) will be displayed in the "Past Issues" card.</li>
                <li>Drag issues to reorder them - the first issue in the list becomes the "Current" issue.</li>
              </ul>
            </div>

            {/* Past Issues Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700">Newsletter Issues</h3>
                <span className="text-xs text-slate-500">Drag to reorder • First issue = Current, Rest = Past Issues</span>
              </div>
            {newsletterIssues.map((item, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                    <span className="text-xs font-medium text-slate-500">Issue {index + 1}</span>
                  </div>
                  {index === 0 ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">CURRENT</span>
                  ) : (
                    <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-full">PAST ISSUE</span>
                  )}
                </div>
                <input
                  type="text"
                  value={item.month || ''}
                  onChange={(e) => {
                    const updated = [...newsletterIssues];
                    updated[index] = { ...item, month: e.target.value };
                    setNewsletterIssues(updated);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="Month (e.g., December 2025)"
                />
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...newsletterIssues];
                    updated[index] = { ...item, title: e.target.value };
                    setNewsletterIssues(updated);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Issue Title"
                />
                <input
                  type="text"
                  value={item.link}
                  onChange={(e) => {
                    const updated = [...newsletterIssues];
                    updated[index] = { ...item, link: e.target.value };
                    setNewsletterIssues(updated);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="Link"
                />
                <button onClick={() => deleteNewsletterIssue(index)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            ))}
              <div className="flex gap-3">
                <button onClick={addNewsletterIssue} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                  <Plus className="w-4 h-4" /> Add Issue
                </button>
                <button onClick={saveNewsletterIssues} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  <Save className="w-4 h-4" /> Save All
                </button>
              </div>
            </div>

            {/* Newsletter Subscribers Section */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-700">Newsletter Subscribers</h3>
                  <p className="text-sm text-slate-500">
                    {newsletterSubscribers.filter(s => s.is_active).length} active of {newsletterSubscribers.length} total subscribers
                  </p>
                </div>
                <button 
                  onClick={exportSubscribers}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  <Mail className="w-4 h-4" /> Export CSV
                </button>
              </div>
              
              {newsletterSubscribers.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No subscribers yet</p>
                  <p className="text-xs mt-1">Subscribers will appear here when people sign up on your website</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Email</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Subscribed</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {newsletterSubscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900">{subscriber.email}</div>
                            {subscriber.name && <div className="text-xs text-slate-500">{subscriber.name}</div>}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {new Date(subscriber.subscribed_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              subscriber.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {subscriber.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => subscriber.id && toggleSubscriberStatus(subscriber.id, subscriber.is_active)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  subscriber.is_active 
                                    ? 'text-orange-600 hover:bg-orange-50' 
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={subscriber.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {subscriber.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => subscriber.id && deleteSubscriber(subscriber.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </SectionWrapper>

      </main>
    </div>
  );
}
