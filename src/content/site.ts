const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL

export const site = {
  name: 'Mihir Patel',
  role: 'Software developer',
  location: 'Pennsylvania',
  description:
    'Mihir Patel is a software developer in Pennsylvania building full-stack web and mobile apps.',
  // Vercel exposes the production domain at build time, so a custom domain
  // is picked up here automatically once it's added to the project
  url: productionHost
    ? `https://${productionHost}`
    : 'https://mihir-patel.vercel.app',
  github: 'https://github.com/Mihir9702',
  linkedin: 'https://www.linkedin.com/in/mihirpatel97',
  // Add an address to show an "Email me" button in the contact section
  email: '',
}
