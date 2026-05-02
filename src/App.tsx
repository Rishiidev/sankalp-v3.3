import React, { useEffect, useState } from 'react';
import { useStore } from './lib/store';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
const Onboarding = React.lazy(() => import('./screens/Onboarding').then(m => ({ default: m.Onboarding })));
const Home = React.lazy(() => import('./screens/Home').then(m => ({ default: m.Home })));
const Sadhana = React.lazy(() => import('./screens/Sadhana').then(m => ({ default: m.Sadhana })));
const Progress = React.lazy(() => import('./screens/Progress').then(m => ({ default: m.Progress })));
const Profile = React.lazy(() => import('./screens/Profile').then(m => ({ default: m.Profile })));
const SacredText = React.lazy(() => import('./screens/SacredText').then(m => ({ default: m.SacredText })));
const Journal = React.lazy(() => import('./screens/Journal').then(m => ({ default: m.Journal })));
import { AnimatePresence, motion } from 'motion/react';
import { Route, Switch, useLocation } from 'wouter';

function AppContent() {
  const user = useStore(state => state.user);
  const loading = useStore(state => state.loading);
  const init = useStore(state => state.init);
  const [location, setLocation] = useLocation();

  // Initialize the Zustand store on mount (loads IndexedDB data)
  useEffect(() => {
    init();
  }, [init]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.onboardingCompleted) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Onboarding />
      </React.Suspense>
    );
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <React.Suspense fallback={
            <div className="h-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <Switch>
              <Route path="/">
                <ErrorBoundary screenName="Home">
                  <Home onNavigate={setLocation} />
                </ErrorBoundary>
              </Route>
              <Route path="/sadhana">
                <ErrorBoundary screenName="Sadhana">
                  <Sadhana onOpenChalisa={() => setLocation('/chalisa')} />
                </ErrorBoundary>
              </Route>
              <Route path="/journal">
                <ErrorBoundary screenName="Journal">
                  <Journal />
                </ErrorBoundary>
              </Route>
              <Route path="/progress">
                <ErrorBoundary screenName="Progress">
                  <Progress />
                </ErrorBoundary>
              </Route>
              <Route path="/profile">
                <ErrorBoundary screenName="Profile">
                  <Profile />
                </ErrorBoundary>
              </Route>
              <Route path="/chalisa">
                <ErrorBoundary screenName="Sacred Text">
                  <SacredText onBack={() => window.history.back()} />
                </ErrorBoundary>
              </Route>
            </Switch>
          </React.Suspense>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
