import React, { useState } from 'react';
import { GeneratedContent, ImageData, Platform } from '../types';
import { Copy, Check, Download, RefreshCcw, Image as ImageIcon, Share2 } from 'lucide-react';

interface ResultCardProps {
  platform: Platform;
  data: GeneratedContent | null;
  imageData: ImageData;
  aspectRatioLabel: string;
  onRegenerateImage: () => void;
}

const platformConfig = {
  [Platform.Facebook]: {
    color: 'bg-blue-600',
    icon: (className: string) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.059v.913h3.945l-.526 3.667h-3.419v7.98h-4.844Z" />
      </svg>
    ),
    label: 'Facebook',
  },
  [Platform.Twitter]: {
    color: 'bg-black',
    icon: (className: string) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    label: 'Twitter / X',
  },
  [Platform.Instagram]: {
    color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500',
    icon: (className: string) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    label: 'Instagram',
  },
};

const ResultCard: React.FC<ResultCardProps> = ({ platform, data, imageData, aspectRatioLabel, onRegenerateImage }) => {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const config = platformConfig[platform];

  const handleCopy = () => {
    if (data?.text) {
      navigator.clipboard.writeText(data.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (imageData.url) {
      const link = document.createElement('a');
      link.href = imageData.url;
      link.download = `${platform}-social-image.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (!data || !imageData.url) return;

    setIsSharing(true);
    try {
      const response = await fetch(imageData.url);
      const blob = await response.blob();
      const file = new File([blob], `${platform.toLowerCase()}-post.png`, { type: 'image/png' });

      const shareData = {
        title: `SocialSage - ${platform}`,
        text: data.text,
        files: [file]
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        alert('Sharing is not supported on this device. Please use Copy or Download manually.');
      }
    } catch (error) {
      if ((error as any).name !== 'AbortError') {
        console.error('Share failed:', error);
      }
    } finally {
      setIsSharing(false);
    }
  };

  if (!data && !imageData.loading) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full transition-colors duration-300">
      <div className={`p-3 ${config.color} text-white flex items-center gap-2`}>
        {config.icon('w-5 h-5')}
        <h3 className="font-semibold">{config.label}</h3>
        <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">{aspectRatioLabel} Image</span>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4">
        {/* Text Section */}
        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700 relative group transition-colors duration-300">
            {!data ? (
                <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                </div>
            ) : (
                <>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{data.text}</p>
                    <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50 dark:hover:bg-slate-700"
                        title="Copy text"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />}
                    </button>
                </>
            )}
        </div>

        {/* Image Section */}
        <div className="relative mt-auto">
          <div className={`bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center relative transition-colors duration-300 ${
              platform === Platform.Twitter ? 'aspect-video' : 'aspect-[4/3]'
            } ${platform === Platform.Instagram ? 'aspect-square' : ''}
          `}>
             {imageData.loading ? (
                <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium">Designing image...</span>
                </div>
             ) : imageData.error ? (
                <div className="text-center p-4">
                    <p className="text-red-500 text-xs mb-2">Generation failed</p>
                    <button onClick={onRegenerateImage} className="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline">
                        <RefreshCcw className="w-3 h-3" /> Retry
                    </button>
                </div>
             ) : imageData.url ? (
                 <>
                    <img src={imageData.url} alt={`Generated for ${platform}`} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 flex gap-2">
                         <button
                            onClick={handleShare}
                            disabled={isSharing}
                            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Share Post"
                         >
                             {isSharing ? (
                                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                             ) : (
                                <Share2 className="w-4 h-4" />
                             )}
                         </button>
                         <button
                            onClick={handleDownload}
                            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                            title="Download Image"
                         >
                             <Download className="w-4 h-4" />
                         </button>
                    </div>
                 </>
             ) : (
                 <div className="flex flex-col items-center text-slate-300 dark:text-slate-600">
                     <ImageIcon className="w-8 h-8 mb-1" />
                     <span className="text-xs">No image yet</span>
                 </div>
             )}
          </div>
           {/* Image Prompt (Optional, can be hidden or shown in a tooltip) */}
           {data?.imagePrompt && (
               <details className="mt-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                   <summary className="hover:text-slate-700 dark:hover:text-slate-300">View Image Prompt</summary>
                   <p className="mt-1 p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-700 italic">{data.imagePrompt}</p>
               </details>
           )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;