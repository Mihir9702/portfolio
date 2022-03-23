import React from 'react'
import AboutSection from './AboutSection'
import Code from './Code'

// TODO | Change this lol
const About: React.FC = () => {
  return (
    <section className="bg-gray-50 py-24 text-gray-900">
      <div className="mx-auto flex  max-w-5xl flex-col items-center justify-center px-4 sm:px-6 md:flex-row lg:px-8">
        <Code />
        <AboutSection />
      </div>
    </section>
  )
}

export default About