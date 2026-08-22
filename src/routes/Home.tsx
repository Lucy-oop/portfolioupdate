import Hero from '../components/sections/Hero'
import Work from '../components/sections/Work'
import DesignWork from '../components/sections/DesignWork'
import Stack from '../components/sections/Stack'
import About from '../components/sections/About'
import Contact from '../components/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <DesignWork />
      <Stack />
      <About />
      <Contact />
    </>
  )
}
