import React, { useState, useEffect } from 'react';
import { AppState, Platform, Tone, SocialPostsResponse } from './types';
import { generateSocialText, generateSocialImage } from './services/gemini';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import { Share2, Sun, Moon } from 'lucide-react';

const initialState: AppState = {
  facebook: { content: null, image: { url: '', loading: false } },
  twitter: { content: null, image: { url: '', loading: false } },
  instagram: { content: null, image: { url: '', loading: false } },
};

const App: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.Professional);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [results, setResults] = useState<AppState>(initialState);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize dark mode state based on document class
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleGenerate = async () => {
    setIsGeneratingText(true);
    setError(null);
    setResults(initialState); // Reset results

    try {
      // Step 1: Generate Text Content
      const textResponse: SocialPostsResponse = await generateSocialText(idea, tone);

      // Update state with text and start loading images
      setResults({
        facebook: { content: textResponse.facebook, image: { url: '', loading: true } },
        twitter: { content: textResponse.twitter, image: { url: '', loading: true } },
        instagram: { content: textResponse.instagram, image: { url: '', loading: true } },
      });
      
      setIsGeneratingText(false); // Text done, images processing

      // Step 2: Generate Images in Parallel
      // We don't await here because we want the UI to update immediately with text
      // while images load independently.
      generateImageForPlatform(Platform.Facebook, textResponse.facebook.imagePrompt, '4:3');
      generateImageForPlatform(Platform.Twitter, textResponse.twitter.imagePrompt, '16:9');
      generateImageForPlatform(Platform.Instagram, textResponse.instagram.imagePrompt, '1:1');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate content. Please try again.');
      setIsGeneratingText(false);
    }
  };

  const generateImageForPlatform = async (
    platform: Platform, 
    prompt: string, 
    aspectRatio: '1:1' | '16:9' | '4:3' | '3:4' | '9:16'
  ) => {
    try {
      const imageUrl = await generateSocialImage(prompt, aspectRatio);
      setResults((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          image: { url: imageUrl, loading: false, error: undefined },
        },
      }));
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          image: { ...prev[platform].image, loading: false, error: 'Failed' },
        },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-lg text-white shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-violet-700 dark:from-indigo-400 dark:to-violet-400">
              SocialSage
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
              AI-Powered Content Generator
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 transition-colors duration-300">One Idea, Every Platform.</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors duration-300">
              Instantly draft tailored posts and generate perfectly sized images for Facebook, X, and Instagram.
            </p>
          </div>

          <InputForm
            idea={idea}
            setIdea={setIdea}
            tone={tone}
            setTone={setTone}
            onGenerate={handleGenerate}
            isGenerating={isGeneratingText}
          />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg mb-8 text-center">
              {error}
            </div>
          )}
        </div>

        {(results.facebook.content || results.facebook.image.loading) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ResultCard
              platform={Platform.Facebook}
              data={results.facebook.content}
              imageData={results.facebook.image}
              aspectRatioLabel="4:3"
              onRegenerateImage={() => results.facebook.content && generateImageForPlatform(Platform.Facebook, results.facebook.content.imagePrompt, '4:3')}
            />
            <ResultCard
              platform={Platform.Twitter}
              data={results.twitter.content}
              imageData={results.twitter.image}
              aspectRatioLabel="16:9"
              onRegenerateImage={() => results.twitter.content && generateImageForPlatform(Platform.Twitter, results.twitter.content.imagePrompt, '16:9')}
            />
            <ResultCard
              platform={Platform.Instagram}
              data={results.instagram.content}
              imageData={results.instagram.image}
              aspectRatioLabel="1:1"
              onRegenerateImage={() => results.instagram.content && generateImageForPlatform(Platform.Instagram, results.instagram.content.imagePrompt, '1:1')}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;