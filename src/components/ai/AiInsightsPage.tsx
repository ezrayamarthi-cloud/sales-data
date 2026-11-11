import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Send,
  RefreshCw,
  Award,
  Zap,
  ArrowRight,
  ShieldCheck,
  Brain,
  MessageSquare,
  Bot,
  User as UserIcon,
} from 'lucide-react';
import type { AiAnalysisResult } from '../../types';

interface AiInsightsPageProps {
  aiAnalysis: AiAnalysisResult | null;
  loading: boolean;
  onRefreshAnalysis: () => Promise<void>;
}

export const AiInsightsPage: React.FC<AiInsightsPageProps> = ({
  aiAnalysis,
  loading,
  onRefreshAnalysis,
}) => {
  // Chat state with Gemini
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Sales Intelligence Advisor powered by Google Gemini 3.8 Flash. I have reviewed your active dataset. Ask me anything—such as "Which region has the highest margin?" or "How can we bundle products to improve Q4 profits?"',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);

    setChatLoading(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: data.answer || 'Analysis completed based on the current dataset.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Encountered an issue communicating with the AI server. Please check that the server is online.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const sampleQuestions = [
    'What are our top 3 products by revenue and margin?',
    'Which region is underperforming its target?',
    'How can we increase profitability in 2026?',
    'What payment method has the highest deal size?',
  ];

  return (
    <div className="space-y-6">
      {/* Top AI Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Google Gemini 3.8 Flash • Executive Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI-Powered Sales Intelligence & Forecasts
            </h1>
            <p className="mt-2 text-sm text-purple-100/90 leading-relaxed">
              Automated pattern detection, product diagnostic benchmarks, demand forecasting, and profit-boosting recommendations grounded exclusively on actual sales figures.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onRefreshAnalysis()}
              disabled={loading}
              className="px-5 py-3 rounded-2xl bg-white text-purple-900 hover:bg-purple-50 disabled:opacity-60 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 text-purple-700 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Synthesizing Data...' : 'Re-run Gemini AI Audit'}</span>
            </button>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none" />
      </div>

      {/* Executive Summary Card */}
      {aiAnalysis && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Executive Synthesis
              </h2>
              <span className="text-[11px] text-slate-400">
                Audited {new Date(aiAnalysis.generatedAt).toLocaleString()}
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {aiAnalysis.summary}
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
            {aiAnalysis.keyFindings.map((finding, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/50 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                  {finding}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Best-Selling & Low-Performing Products */}
      {aiAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Best Selling Products */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Best-Selling Product Drivers
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  High Velocity
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {aiAnalysis.bestSellingProducts.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {p.name}
                      </span>
                      <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                        ${p.revenue.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {p.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Low Performing Products & Turnaround */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Low-Performing Products Diagnostic
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">
                  Inventory Caution
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {aiAnalysis.lowPerformingProducts.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {p.name}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        ${p.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                      ⚠️ {p.inventoryWarning}
                    </div>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5 font-medium">
                      💡 Suggestion: {p.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Patterns & Sales Trends Prediction */}
      {aiAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Patterns */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <Zap className="w-4 h-4 text-amber-500" />
              Observed Revenue Patterns
            </h3>
            <ul className="mt-4 space-y-2.5">
              {aiAnalysis.revenuePatterns.map((pat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{pat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sales Trends Prediction */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Quarterly Sales Forecast & Trajectory
            </h3>
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
              <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed">
                {aiAnalysis.salesTrendsPrediction}
              </p>
            </div>
            <div className="mt-4 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Projected using real historical order velocity without synthetic bias.</span>
            </div>
          </div>
        </div>
      )}

      {/* Strategic AI Business Recommendations */}
      {aiAnalysis && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                High-Impact Business Recommendations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prioritized commercial initiatives generated from transaction patterns
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiAnalysis.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        rec.impact === 'High'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      }`}
                    >
                      {rec.impact} Impact
                    </span>
                    {rec.metricReference && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        {rec.metricReference}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {rec.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                    Action Plan:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                    {rec.actionableStep}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Profit Boosting Strategies Section */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Actionable Profit Boosting Playbook
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {aiAnalysis.profitBoostingStrategies.map((strat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 flex items-start gap-2.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-purple-950 dark:text-purple-200 font-medium leading-relaxed">
                    {strat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Conversational Sales Intelligence Chat Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Conversational Sales Analyst
              </h3>
              <p className="text-xs text-slate-400">
                Ask questions about your sales data in natural language
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            Ready
          </span>
        </div>

        {/* Chat message history */}
        <div className="p-4 sm:p-6 max-h-96 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {m.sender === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-xl rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-xs shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 ${
                    m.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {chatLoading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                <Bot className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-xs p-3 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                Analyzing dataset with Gemini...
              </div>
            </div>
          )}
        </div>

        {/* Sample prompt chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
            Suggested:
          </span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setChatInput(q)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-950/60 dark:hover:text-purple-300 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder="Type your question about sales, products, or margins..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || chatLoading}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
