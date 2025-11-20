import React from 'react';
import { Tone } from '../types';
import { Send, Wand2 } from 'lucide-react';

interface InputFormProps {
  idea: string;
  setIdea: (idea: string) => void;
  tone: Tone;
  setTone: (tone: Tone) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ idea, setIdea, tone, setTone, onGenerate, isGenerating }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <Wand2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        Create Content
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="idea" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            What's your post about?
          </label>
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., Launching a new eco-friendly coffee cup line next week..."
            className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[100px] resize-y placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Tone of Voice
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(Tone).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  tone === t
                    ? 'bg-indigo-600 text-white shadow-md dark:bg-indigo-500'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onGenerate}
            disabled={isGenerating || !idea.trim()}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-all ${
              isGenerating || !idea.trim()
                ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg active:scale-[0.99] dark:from-indigo-500 dark:to-violet-500'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Magic...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate All Posts
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputForm;