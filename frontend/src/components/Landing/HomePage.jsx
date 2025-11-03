import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BarChart3, Brain, Zap, Shield, TrendingUp, MessageSquare, FileSpreadsheet, Palette, ArrowRight, LogIn, Play } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  
  const openDemoVideo = () => {
    window.open('https://www.loom.com/share/6762589925ea46108001f4e7f4db3992', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">AI Analyst</span>
              <button
                onClick={openDemoVideo}
                className="ml-4 px-4 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Watch Demo
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 text-gray-300 hover:text-white font-medium transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">AI-Powered Data Analysis</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Data into
            <span className="block bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Actionable Insights
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Ask questions in plain English. Get instant SQL queries, beautiful visualizations, 
            and AI-powered insights. No coding required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/pricing')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 text-lg"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all text-lg"
            >
              Learn More
            </button>
          </div>
          
          {/* Login Link */}
          <div className="mt-8">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-green-400 hover:text-green-300 font-semibold transition-colors inline-flex items-center gap-1"
              >
                Login here
                <ArrowRight className="w-4 h-4" />
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to analyze data
            </h2>
            <p className="text-xl text-gray-400">
              Powerful features designed for modern data analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 hover:border-green-500/50 transition-all">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-3 rounded-xl w-fit mb-6">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Natural Language Queries</h3>
              <p className="text-gray-400 leading-relaxed">
                Ask questions in plain English. Our AI converts them to SQL automatically using advanced language models.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 hover:border-green-500/50 transition-all">
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-3 rounded-xl w-fit mb-6">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Interactive Visualizations</h3>
              <p className="text-gray-400 leading-relaxed">
                Generate beautiful charts instantly. Bar, pie, line charts, and tables - all interactive and customizable.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 hover:border-green-500/50 transition-all">
              <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-3 rounded-xl w-fit mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Instant Insights</h3>
              <p className="text-gray-400 leading-relaxed">
                Get AI-generated insights for every query. Understand trends, patterns, and anomalies automatically.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 hover:border-green-500/50 transition-all">
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-3 rounded-xl w-fit mb-6">
                <FileSpreadsheet className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Multiple Data Sources</h3>
              <p className="text-gray-400 leading-relaxed">
                Upload CSV and Excel files seamlessly. Your data is securely stored and ready for analysis.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 hover:border-green-500/50 transition-all">
              <div className="bg-gradient-to-r from-pink-400 to-pink-500 p-3 rounded-xl w-fit mb-6">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Customizable Dashboards</h3>
              <p className="text-gray-400 leading-relaxed">
                Choose from 10 color themes. Create professional dashboards and present them in full-screen mode.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 hover:border-green-500/50 transition-all">
              <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 p-3 rounded-xl w-fit mb-6">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Chat Interface</h3>
              <p className="text-gray-400 leading-relaxed">
                Chat interface makes data analysis intuitive. Ask multiple questions and get instant responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-400">
              From data to insights in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Upload Your Data</h3>
              <p className="text-gray-400 leading-relaxed">
                Simply upload your CSV or Excel files. We support all common data formats.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Ask Questions</h3>
              <p className="text-gray-400 leading-relaxed">
                Type your questions in plain English. Our AI understands and processes them instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Get Insights</h3>
              <p className="text-gray-400 leading-relaxed">
                Receive beautiful visualizations and AI-powered insights immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Perfect for every team
            </h2>
            <p className="text-xl text-gray-400">
              Powerful data analysis for all industries
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8">
              <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-3">Sales & Marketing</h3>
              <p className="text-gray-400 leading-relaxed">
                Analyze revenue trends, track campaign performance, and identify top-performing products instantly.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/10 border border-blue-500/20 rounded-2xl p-8">
              <Shield className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-3">Finance & Operations</h3>
              <p className="text-gray-400 leading-relaxed">
                Track expenses, monitor budgets, and generate financial reports with AI-powered insights.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/10 border border-purple-500/20 rounded-2xl p-8">
              <BarChart3 className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-3">Product Analytics</h3>
              <p className="text-gray-400 leading-relaxed">
                Understand user behavior, track feature adoption, and make data-driven product decisions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/10 border border-orange-500/20 rounded-2xl p-8">
              <Brain className="w-12 h-12 text-orange-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-3">Research & Development</h3>
              <p className="text-gray-400 leading-relaxed">
                Analyze experimental data, identify patterns, and generate comprehensive research reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to transform your data?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Start analyzing your data with AI today. No credit card required.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 text-lg mx-auto"
            >
              Get Started Free
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AI Analyst</span>
            </div>
            <p className="text-gray-400 text-center">
              © 2024 AI Analyst. Transform data into insights with AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
