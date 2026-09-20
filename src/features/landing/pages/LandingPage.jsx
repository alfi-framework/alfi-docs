import { Navbar } from '../../../shared/components/ui/Navbar'
import { HeroSection } from '../components/HeroSection'
import { CodePreview } from '../components/CodePreview'
import { FeatureGrid } from '../components/FeatureGrid'
import { Footer } from '../components/Footer'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CodePreview />
        <FeatureGrid />
      </main>
      <Footer />
    </div>
  )
}
