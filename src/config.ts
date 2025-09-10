// DevPortfolio template: dynamic config builder and types

export type DevPortfolioSiteConfig = {
  name: string
  title: string
  description: string
  accentColor: string
  resumeUrl?: string
  social: {
    email?: string
    linkedin?: string
    twitter?: string
    github?: string
  }
  aboutMe: string
  skills: string[]
  projects: Array<{
    name: string
    description?: string
    link?: string
    skills?: string[]
  }>
  experience: Array<{
    company: string
    title: string
    dateRange?: string
    bullets: string[]
  }>
  education: Array<{
    school: string
    degree?: string
    dateRange?: string
    achievements: string[]
  }>
}

// Normalized input that templates can depend on
import type { TemplateInput } from '../../_shared/types'

export const DEFAULT_ACCENT = '#1d4ed8'

// Transform DB portfolio data into this template's config
export function buildSiteConfig(input: TemplateInput): DevPortfolioSiteConfig {
  const fullName = [input.user?.firstName, input.user?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim() || 'Your Name'

  const skills: string[] = (input.skills || [])
    .map(s => s?.name)
    .filter(Boolean) as string[]

  const projects = (input.projects || []).map(p => ({
    name: p.name,
    description: p.description || undefined,
    link: p.link || undefined,
    skills: (p.techStack || '')
      .split(/[,|]/)
      .map(s => s.trim())
      .filter(Boolean),
  }))

  const experience = (input.experiences || []).map(e => ({
    company: e.companyName,
    title: e.title,
    dateRange: [e.startDate, e.endDate].filter(Boolean).join(' - ') || undefined,
    bullets: (e.bullets && e.bullets.length ? e.bullets : (e.description || '')
      .split(/\n|•|-/)
      .map(b => b.trim())
      .filter(Boolean)),
  }))

  const education = (input.education || []).map(ed => ({
    school: ed.school,
    degree: [ed.degree, ed.field].filter(Boolean).join(' • ') || undefined,
    dateRange: [ed.startDate, ed.endDate].filter(Boolean).join(' - ') || undefined,
    achievements: (ed.description || '')
      .split(/\n|•|-/)
      .map(a => a.trim())
      .filter(Boolean),
  }))

  const social = {
    email: input.user?.email || undefined,
    linkedin: input.user?.linkedInUrl || undefined,
    twitter: undefined, // not captured in current schema
    github: input.user?.githubUrl || undefined,
  }

  return {
    name: fullName,
    title: input.roleTitle || input.portfolio?.title || 'Professional Title',
    description: input.summary || `Portfolio website of ${fullName}`,
    accentColor: DEFAULT_ACCENT,
    resumeUrl: input.resumeUrl || undefined,
    social,
    aboutMe: input.summary ||
      'Write a concise summary highlighting your strengths, passions, and what you bring to a team.',
    skills,
    projects,
    experience,
    education,
  }
}

// Sample config for local development and as a fallback
export const siteConfig: DevPortfolioSiteConfig = {
  name: 'Ryan Fitzgerald',
  title: 'Senior Software Engineer',
  description: 'Portfolio website of Ryan Fitzgerald',
  accentColor: DEFAULT_ACCENT,
  social: {
    email: 'your-email@example.com',
    linkedin: 'https://linkedin.com/in/yourprofile',
    twitter: 'https://x.com/rfitzio',
    github: 'https://github.com/RyanFitzgerald',
  },
  aboutMe:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem quos asperiores nihil consequatur tempore cupiditate architecto natus commodi corrupti quas quasi facere est, dignissimos odit nam veniam sapiente ut, vitae eligendi ipsum dolor, nostrum ullam impedit! Corrupti ratione mollitia temporibus necessitatibus, consectetur reiciendis recusandae id, dolorum quaerat, vero pariatur. Ratione!',
  skills: ['Javascript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
  projects: [
    {
      name: 'AI Dev Roundup Newsletter',
      description:
        'One concise email. Five minutes. Every Tuesday. Essential AI news & trends, production-ready libraries, powerful AI tools, and real-world code examples',
      link: 'https://aidevroundup.com/?ref=devportfolio',
      skills: ['React', 'Node.js', 'AWS'],
    },
    {
      name: 'Chrome Extension Mastery: Build Full-Stack Extensions with React & Node.js',
      description:
        'Master the art of building production-ready, full-stack Chrome Extensions using modern web technologies and best practices',
      link: 'https://fullstackextensions.com/?ref=devportfolio',
      skills: ['React', 'Node.js', 'AWS'],
    },
    {
      name: 'ExtensionKit',
      description:
        'Kit to jump-start your Chrome extension projects with a variety of battle-tested starter templates & examples',
      link: 'https://extensionkit.io/?ref=devportfolio',
      skills: ['React', 'Node.js', 'AWS'],
    },
  ],
  experience: [
    {
      company: 'Tech Company',
      title: 'Senior Software Engineer',
      dateRange: 'Jan 2022 - Present',
      bullets: [
        'Led development of microservices architecture serving 1M+ users',
        'Reduced API response times by 40% through optimization',
        'Mentored team of 5 junior developers',
      ],
    },
    {
      company: 'Startup Inc',
      title: 'Full Stack Developer',
      dateRange: 'Jun 2020 - Dec 2021',
      bullets: [
        'Built and launched MVP product from scratch using React and Node.js',
        'Implemented CI/CD pipeline reducing deployment time by 60%',
        'Collaborated with product team to define technical requirements',
      ],
    },
    {
      company: 'Digital Agency',
      title: 'Frontend Developer',
      dateRange: 'Aug 2018 - May 2020',
      bullets: [
        'Developed responsive web applications for 20+ clients',
        'Improved site performance scores by 35% on average',
        'Introduced modern JavaScript frameworks to legacy codebases',
      ],
    },
  ],
  education: [
    {
      school: 'University Name',
      degree: 'Bachelor of Science in Computer Science',
      dateRange: '2014 - 2018',
      achievements: [
        "Graduated Magna Cum Laude with 3.8 GPA",
        "Dean's List all semesters",
        'President of Computer Science Club',
      ],
    },
    {
      school: 'Online Platform',
      degree: 'Full Stack Development Certificate',
      dateRange: '2019',
      achievements: [
        'Completed 500+ hours of coursework',
        'Built 10+ portfolio projects',
        'Specialized in React and Node.js',
      ],
    },
  ],
}

// Utility used by the Astro page to fetch config at runtime
export async function fetchSiteConfig(baseUrl: string, portfolioId?: string | null): Promise<DevPortfolioSiteConfig> {
  if (!portfolioId) return siteConfig
  try {
    const res = await fetch(
      `${baseUrl}/api/public/templates/devportfolio/config?portfolioId=${encodeURIComponent(portfolioId)}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return siteConfig
    const data = await res.json()
    return data.siteConfig as DevPortfolioSiteConfig
  } catch {
    return siteConfig
  }
}
