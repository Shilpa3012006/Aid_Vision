import { SymptomChecker } from '@/components/symptom-checker';
import { PlusCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-2xl w-full">
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <PlusCircle className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight font-headline text-primary">
                AidVision
              </h1>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
              Your First-Aid Assistant
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Get instant, AI-powered first-aid guidance. Describe your symptom, optionally upload a photo, and receive clear, actionable steps.
            </p>
          </header>

          <SymptomChecker />
        </div>
      </main>
      <footer className="py-4 px-8 text-center text-xs text-muted-foreground">
        <p>This app is for informational purposes only and is not a substitute for professional medical advice. Always consult a qualified healthcare provider.</p>
      </footer>
    </div>
  );
}
