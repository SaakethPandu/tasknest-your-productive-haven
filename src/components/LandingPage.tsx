import { motion } from 'framer-motion';
import { CheckSquare, Layout, Layers, Sparkles, ArrowRight, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const features = [
  {
    icon: Layout,
    title: 'Multiple Boards',
    description: 'Organize your projects with separate boards for different workflows.',
  },
  {
    icon: Layers,
    title: 'Customizable Lists',
    description: 'Create columns with custom names and colors to match your process.',
  },
  {
    icon: Sparkles,
    title: 'Drag & Drop',
    description: 'Effortlessly move tasks between columns with smooth animations.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function LandingPage({ onGetStarted, theme, onToggleTheme }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-sm border-b"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 tasknest-gradient rounded-xl flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">TaskNest</h1>
            <p className="text-xs text-muted-foreground">by BhimSaaStudios</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Organize your tasks beautifully
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Your tasks,{' '}
            <span className="tasknest-text-gradient">organized</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            A modern Kanban board to help you manage projects, track progress, and stay productive. Simple, powerful, and beautiful.
          </motion.p>

          <motion.div variants={item}>
            <Button
              size="lg"
              onClick={onGetStarted}
              className="tasknest-gradient text-white px-8 py-6 text-lg rounded-xl hover:opacity-90 transition-opacity group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Everything you need to stay organized
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="p-6 rounded-2xl bg-card card-shadow hover:card-shadow-hover transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl tasknest-gradient flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How it works
          </motion.h2>

          <motion.div
            className="space-y-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { step: '1', title: 'Create a Board', desc: 'Start by creating a new board for your project or workflow.' },
              { step: '2', title: 'Add Lists', desc: 'Create columns like "To Do", "In Progress", and "Done" with custom colors.' },
              { step: '3', title: 'Add Tasks', desc: 'Create task cards with titles, descriptions, and colored tags.' },
              { step: '4', title: 'Drag & Drop', desc: 'Move tasks between columns as you make progress.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { opacity: 1, x: 0 },
                }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full tasknest-gradient flex items-center justify-center text-white font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-2xl mx-auto text-center p-10 rounded-3xl tasknest-gradient"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get organized?
          </h2>
          <p className="text-white/80 mb-6">
            Start managing your tasks with TaskNest today.
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg rounded-xl"
          >
            Create Your First Board
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t text-center text-muted-foreground">
        <p>© 2026 TaskNest by BhimSaaStudios. All data stored locally.</p>
      </footer>
    </div>
  );
}
