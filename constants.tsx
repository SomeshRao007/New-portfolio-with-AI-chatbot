import React from 'react';
import type { Skill, SkillCategory, Certification, TimelineEvent, LearningItem, Project, Testimonial } from './types';


const PERSONAL_INFO = {
  name: "Somesh Rao Coka",
  title: "DevOps & AI Engineer",
  profileImageUrl: "/images/me.jpeg", 
  bio: `I am a DevOps Engineer at Cloudpepper and an AWS Certified Solutions Architect. With a Master’s degree focused on AI-driven Kubernetes autoscaling, I combine deep research capabilities with practical operational experience. I specialize in automating complex infrastructures—recently managing a 3,000-server migration and cutting deployment build time by 40%. I am passionate about building self-healing, scalable systems using Terraform, Ansible, and Docker. My goal is to leverage AI and cloud technologies to create efficient, resilient solutions that drive business success.`,
  socialLinks: [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/someshrao007', icon: '/images/social/linkedin-svgrepo-com-min.png' },
    { name: 'GitHub', url: 'https://github.com/SomeshRao007', icon: '/images/social/github-svgrepo-com-min.png' },
    { name: 'Instagram', url: 'https://www.instagram.com/somesh_rao_07/', icon: '/images/social/instagram-1-svgrepo-com-min.png' },
  ],
  formspreeEndpoint: "https://formspree.io/f/xleqeywr",
  cvUrl: "https://drive.google.com/file/d/1E_IQDmlaig8ZolNYRQwpsUzPu0988ZkO/view?usp=sharing",
};

const SKILLS_DATA: SkillCategory[] = [
    {
        name: 'Cloud Platform',
        skills: [
            { name: 'AWS', icon: '/images/skills/aws.png' },
            { name: 'OVH', icon: '/images/skills/ovh-v2-svgrepo-com.png' },
            { name: 'Google Cloud Platform', icon: '/images/skills/gcp-svgrepo-com.png' },
            { name: 'Digital Ocean', icon: '/images/skills/digital-ocean-svgrepo-com.png' },
            { name: 'Azure', icon: '/images/skills/Azure.png' },
            { name: 'Linode', icon: '/images/skills/akamai-svgrepo-com.png' }
        ]
    },
    {
        name: 'DevOps',
        skills: [
            { name: 'Identity and Access Managment', icon: '/images/skills/aws-iam-svgrepo-com.png' },
            { name: 'Kubernetes', icon: '/images/skills/kubernetes.png' },
            { name: 'Docker', icon: '/images/skills/docker.png' },
            { name: 'Terraform', icon: '/images/skills/terraform.png' },
            { name: 'Argo CD & Rollouts', icon: '/images/skills/Argo CD.png' },
            { name: 'Jenkins', icon: '/images/skills/jenkins-svgrepo-com.png' },
            { name: 'Tomcat', icon: '/images/skills/tomcat-svgrepo-com.png' },
            { name: 'SonarQube', icon: '/images/skills/sonarqube-svgrepo-com.png' },
            { name: 'Maven', icon: '/images/skills/maven-svgrepo-com.png' },
            { name: 'Linux', icon: '/images/skills/linux.png' },
            { name: 'Windows Server', icon: '/images/skills/Windows 11.png' },
            { name: 'Bash Scripts', icon: '/images/skills/bash.png' },
            { name: 'Remote Desktop Protocol', icon: '/images/skills/microsoft-remote-desktop-svgrepo-com.png' }
        ]
    },
    {
        name: 'Monitoring',
        skills: [
            { name: 'Prometheus', icon: '/images/skills/prometheus-svgrepo-com.png' },
            { name: 'Grafana Dashboard', icon: '/images/skills/monitoring.png' },
            { name: 'SigNoz', icon: '/images/skills/signoz.png' },
            { name: 'DataDog', icon: '/images/skills/datadog-svgrepo-com.png' }
        ]
    },
    {
        name: 'AI/ML',
        skills: [
            { name: 'Deep Learning', icon: '/images/skills/deep_learning.png' },
            { name: 'Langchain', icon: '/images/skills/langchain.png' },
            { name: 'Crew AI', icon: '/images/skills/CrewAI.png' },
            { name: 'Agentic AI systems', icon: '/images/skills/agentic_ai.png' },
            { name: 'N8N Automation', icon: '/images/skills/n8n-logo.png' }
        ]
    },
    {
        name: 'Web Development',
        skills: [
            { name: 'PHP', icon: '/images/skills/php.png' },
            { name: 'Symfony', icon: '/images/skills/symfony-svgrepo-com.png' },
            { name: 'Ruby on Rails', icon: '/images/skills/rails.png' },
            { name: 'HTML', icon: '/images/skills/html-5-svgrepo-com.png' },
            { name: 'CSS', icon: '/images/skills/css-svgrepo-com.png' },
            { name: 'Javascript flavours', icon: '/images/skills/javascript.png' },
            { name: 'Odoo dev', icon: '/images/skills/odoo.png' },
            { name: 'Stripe Payments', icon: '/images/skills/stripe-svgrepo-com.png' }
        ]
    },
    {
        name: 'Programming & Databases',
        skills: [
            { name: 'Python', icon: '/images/skills/python.png' },
            { name: 'YAML', icon: '/images/skills/file-yaml-svgrepo-com.png' },
            { name: 'PSQL', icon: '/images/skills/postgresql-svgrepo-com.png' },
            { name: 'Firebase', icon: '/images/skills/firebase-svgrepo-com.png' },
            { name: 'Android', icon: '/images/skills/android.png' },
            { name: 'Matlab', icon: '/images/skills/matlab.png' }
        ]
    }
];

const CERTIFICATIONS_DATA: Certification[] = [
  {
    title: 'AWS Certified Solutions Architect - Associate',
    issuer: 'Amazon Web Services',
    imageUrl: '/images/SAAC03image.png',
    link: 'https://www.credly.com/badges/9615b539-1c48-4380-9b7e-af96d3472615/public_url',
  },
  {
    title: 'Containers & Kubernetes Essentials',
    issuer: 'IBM',
    imageUrl: '/images/ibm.png',
    link: 'https://www.credly.com/badges/e8c2203b-e36e-4246-903c-35422aee2319/public_url',
  },
  {
    title: 'Azure AZ-900',
    issuer: 'Microsoft',
    imageUrl: '/images/azureaz900.png',
    link: 'https://www.credly.com/badges/08a4c878-63d5-4589-88ff-a504a454d037/public_url',
  },
  {
    title: 'GCP',
    issuer: 'Google Cloud',
    imageUrl: '/images/gcp.png',
    link: 'https://www.credly.com/badges/04bbcd9e-1081-4c09-85d6-66f0daa79cd2/public_url',
  },
  {
    title: 'Certified Kubernetes Administrator (preparing)',
    issuer: 'Linux Foundation',
    imageUrl: '/images/cka.png',
    link: '',
  },
  {
    title: 'Research Presentation',
    issuer: 'ICDSAI 2023',
    imageUrl: '/images/poster.png',
    link: 'https://www.linkedin.com/posts/somesh-rao-coka-7a2b26190_icdsai2023-icdsai-dsai-activity-7140321279840104450-g3VN?utm_source=share&utm_medium=member_desktop',
  },
];

const TIMELINE_DATA: TimelineEvent[] = [
  {
    date: '2024-09-01',
    title: 'DevOps Engineer at Cloudpepper',
    description: 'I have extensive experience managing and automating cloud infrastructure on AWS and OVH to ensure seamless platform operations...',
    fullDescription: 'I have extensive experience managing and automating cloud infrastructure on AWS and OVH to ensure seamless platform operations. I architected and deployed a containerized health check application on AWS using ECS Fargate, SQS, VPC, and CloudWatch, enhancing it with asynchronous request handling for improved performance. The entire infrastructure provisioning for this application was fully automated using Terraform and GitHub Actions.  I successfully migrated SSL certificate management from Traefik to Certbot for over 3000 active servers, developing complex Bash scripts to convert existing certificates. In another initiative, I seamlessly replaced the Traefik reverse proxy with Nginx across all servers using Ansible. To bolster security, I integrated Oauth2 Proxy as a middleware to protect multiple web applications with robust authentication.  I developed a custom, lightweight system to asynchronously monitor server vitals (CPU, RAM, disk usage), providing automated email alerts via AWS SES during sustained high loads. I also engineered an external database integration, enabling Odoo users on our platform to connect with their custom databases.',
    icon: 'work',
  },
  {
    date: '2024-04-01',
    title: 'Intern at Pearlthoughts',
    description: 'I drove a 40% reduction in deployment time and costs by engineering automated workflows on AWS, which also enhanced collaboration efficiency across three key departments...',
    fullDescription: 'I manage AWS cloud infrastructure and have successfully automated workflows across teams, resulting in a 40% reduction in deployment time and cost, while also enhancing collaboration efficiency across three departments. I have researched and integrated an Application Performance Monitoring (APM) solution for a PHP application based on a Yii2 legacy project, with the integrated monitoring tool now being used by over 10 developers. This integration has significantly enhanced observability, improving uptime by 25% and reducing response time by 30%. Additionally, I streamlined workflow automation across various environments, saving 20 hours per month by minimising manual tasks and enhancing productivity through effective tooling. Furthermore, I have optimised Docker images for better security and reduced sizes, further contributing to the overall efficiency and security of our development and deployment processes.',
    icon: 'work',
  },
  {
    date: '2023-11-01',
    title: 'International DSAI Conference',
    description: 'Presented my Masters Reseach work at International Conference on Data Science & Artificial Intelligence...',
    fullDescription: 'Presented my Masters Reseach work at International Conference on Data Science & Artificial Intelligence held at Berkeley Hotel Pratunam, Bangkok, Thailand from 27 to 29 of November 2023',
    icon: 'education',
  },
  {
    date: '2023-08-01',
    title: 'Teaching Assistant for Fullstack Application Development',
    description: 'Designed and implemented course structure for Full Stack Application Development course for Masters students...',
    fullDescription: 'Designed and implemented course structure for Full Stack Application Development course for Masters students. Gave Lectures 6-9 hrs per week on relavent topics such as Web Development & Database Managment. Lead lab sessions, elevating student understanding and engagement in the course.',
    icon: 'work',
  },
  {
    date: '2022-01-01',
    title: 'Asian Institute of Technology',
    description: 'I joined Asian Institute of Technology for Masters in Engineering in the field of Computer Science...',
    fullDescription: 'I joined Asian Institute of Technology for Masters in Engineering in the field of Computer Science, to explore the software world.',
    icon: 'education',
  },
  {
    date: '2021-03-01',
    title: 'Embedded Systems Engineer',
    description: 'At Rivin Infra Tech As a Developed an embedded system with algorithms for remote patient monitoring, achieving 5-day battery life, and 95% accuracy...',
    fullDescription: 'At Rivin Infra Tech As a Developed an embedded system with algorithms for remote patient monitoring, achieving 5-day battery life, and 95% accuracy. Contributed to water-resistant jacket design, gathering customer feedback for product-market fit. Implemented battery health features in BMS with a 2-week time to market, enabling vital monitoring and web reporting. Designed optimized double-sided PCB for wearable devices, ensuring signal integrity (>65 dBm) for WI-FI network.',
    icon: 'work',
  },
  {
    date: '2020-08-01',
    title: 'Hex N Bit',
    description: 'Developed a security system that utilizes microcontrollers and sensors to detect heat radiation from a maximum distance of 10 meters...',
    fullDescription: 'Developed a security system that utilizes microcontrollers and sensors to detect heat radiation from a maximum distance of 10 meters, resulting in successful alert delivery to predefined phone numbers in a timely manner. Verified project performance by conducting various tests such as hardware debugging, software emulation, and field tests to monitor environmental changes. Analyzed project quality by sampling and testing quality and accuracy, resulting in 99% accuracy in response from the machine. Documented project activities, problems, and solutions by recording hardware and software usage, readings, performance data, and engineering notes.',
    icon: 'work',
  },
  {
    date: '2018-08-01',
    title: 'I joined JNTUH',
    description: 'My 4 year B.Tech journey started as an Electronics and Communication Engineer. Started exploring width opportunities instead of depth ones.',
    fullDescription: 'My 4 year B.Tech journey started as an Electronics and Communication Engineer. Started exploring width opportunities instead of depth ones.',
    icon: 'education',
  },
];

const LEARNING_DATA: LearningItem[] = [
    { title: 'Agentic AI Systems', description: 'Exploring feedback based autonomous agents for complex problem-solving.' },
    { title: 'AI Automation with N8N', description: 'Learning how to build powerful workflows (such as integrating excel) and automating tasks with AI.' },
    { title: 'Distilling 8B AI Models', description: 'Teaching small parameter models from a higher paramter models.' },
    { title: 'Advanced CI Pipelines for agentic AI systems', description: 'Implementing intelligent and automated deployment strategies.' },
    { title: 'Serverless Deployments strategies', description: 'Learning how to scale in cost-effective manner in cloud agnostic architectures.' },
    { title: 'Cloud Native Security', description: 'How to Secure modern applications and infrastructure in the cloud.' },
];

const STATS_DATA = [
    { label: 'Cups of Coffee', value: 472 },
    { label: 'Projects', value: 23 },
    { label: 'Events', value: 6 },
    { label: 'Lines of Code', value: 55070 },
];

const PROJECTS_DATA: Project[] = [
  {
    title: 'Odoo Module Automation Pipeline',
    description: 'Just update your code and with a single git push get your odoo modules with in multiple servers updated',
    imageUrl: '/images/Odoo-Module-Automation.png',
    githubUrl: 'https://github.com/SomeshRao007/Odoo_Module_Automation_Pipeline.git',
  },
  {
    title: 'Multimodal Agentic AI system (coding)',
    description: 'Multiple agents coomunicates with each other to solve a single problem efficiently.',
    imageUrl: '/images/multi-modal-ai.png',
    githubUrl: 'https://github.com/SomeshRao007/Multi-Model-AI-System.git',
  },
  {
    title: 'SSL Certificate Migration',
    description: 'SSL Certificates manager Migration within the same server from traefik to Nginx.',
    imageUrl: '/images/ssl migration.png',
    githubUrl: 'https://github.com/SomeshRao007/SSL-Certificates-Migration.git',
  },
  {
    title: 'PROACTIVE AUTOSCALING STRATEGY',
    description: 'A Transformers Based Model',
    imageUrl: '/images/cloud system.png',
    githubUrl: 'https://github.com/SomeshRao007/PROACTIVE-AUTOSCALING-FOR-HIGH-WEB-TRAFFIC-ENVIRONMENTS-A-TRANSFORMERS-BASED-APPROACH.git',
  },
  {
    title: 'GitOps Pipeline with Argo CD in Kubernetes',
    description: 'A complete CI/CD pipelines for automated deployments in K8s',
    imageUrl: '/images/argo.png',
    githubUrl: 'https://github.com/SomeshRao007/GitOps-Pipeline-with-Argo-CD-in-Kubernetes.git',
  },
  {
    title: 'Add a Pinch',
    description: 'A Website made using Ruby on Rails',
    imageUrl: '/images/addapinch.jpg',
    githubUrl: 'https://github.com/SomeshRao007/Add-A-Pinch-website-.git',
  },
  {
    title: 'Spend Track',
    description: 'Android App made using Kotlin',
    imageUrl: '/images/Logo 500x500 px.jpeg',
    githubUrl: 'https://github.com/SomeshRao007/Spend-Track.git',
  },
  {
    title: 'The Ugly 2048',
    description: 'Written in Python played through command Line',
    imageUrl: '/images/2048.png',
    githubUrl: 'https://github.com/SomeshRao007/DSA_Assingment-.git',
  },
  {
    title: 'Smart Patient Health Monitoring System',
    description: 'A Smart Jacket',
    imageUrl: '/images/Picture1.png',
    githubUrl: 'https://github.com/SomeshRao007/SMART-PATIENT-HEALTH-MONITORING-SYSTEM.git',
  },
  {
    title: 'Home Inviolability',
    description: 'A security system',
    imageUrl: '/images/lock .png',
    githubUrl: 'https://github.com/SomeshRao007/Home-inviolability.git',
  },
];

const TESTIMONIALS_DATA: Testimonial[] = [
      {
          id: 1,
          author: "Chantri Polprasert",
          role: "Professor, ICT Department",
          company: "Asian Institute of Technology",
          imgSrc: "/images/social/sir.jpeg",
          quote: "Somesh is highly diligent, technically sharp, and innovative. He is an excellent communicator and collaborator, simplifying complex technical concepts clearly.",
      },
      {
          id: 2,
          author: "Vamshi Goud", 
          role: "Team Lead", 
          company: "Pearlthoughts", 
          imgSrc: "/images/social/vam.jpeg", 
          quote: "He quickly deciphered our legacy Yii2 codebase and integrated essential monitoring tools, instantly enhancing the observability of our complex platform.",
      },
      {
          id: 3,
          author: "Rajnandini", 
          role: "Senior Developer", 
          company: "Ericsson", 
          imgSrc: "/images/social/raj.jpeg", 
          quote: "Somesh is exceptionally quick at solving problems. He is a naturally curious engineer who is always pushing to learn more and grow his capabilities.",
      },
      {
          id: 4,
          author: "Lakshmi Narayana", 
          role: "Information Security Specialist ", 
          company: "PSI", 
          imgSrc: "/images/social/lak.jpeg", 
          quote: "Somesh optimized our AWS infrastructure for maximum network security, delivering significant cost reductions while keeping our systems rock-solid.",
      }

];

export const INITIAL_DATA = {
    personalInfo: PERSONAL_INFO,
    skills: SKILLS_DATA,
    certifications: CERTIFICATIONS_DATA,
    timeline: TIMELINE_DATA,
    learning: LEARNING_DATA,
    stats: STATS_DATA,
    projects: PROJECTS_DATA,
    testimonials: TESTIMONIALS_DATA,
}


export const createPortfolioDataString = (data: typeof INITIAL_DATA) => {
  const { personalInfo, skills, certifications, projects } = data;
  
  const skillsString = skills.map(category => 
    `### ${category.name}\n${category.skills.map(skill => `- ${skill.name}`).join('\n')}`
  ).join('\n\n');

  return `
# About ${personalInfo.name}
- **Name**: ${personalInfo.name}
- **Title**: ${personalInfo.title}
- **Summary**: ${personalInfo.bio}

# Key Skills
${skillsString}

# Certifications
${certifications.map(cert => `- ${cert.title} by ${cert.issuer}`).join('\n')}

# Personal Projects
${projects.map(project => `- **Project**: "${project.title}"\n  - **Description**: ${project.description}`).join('\n')}

# Contact & Socials
- **GitHub**: ${personalInfo.socialLinks.find(l => l.name === 'GitHub')?.url}
- **LinkedIn**: ${personalInfo.socialLinks.find(l => l.name === 'LinkedIn')?.url}
- **Twitter**: ${personalInfo.socialLinks.find(l => l.name === 'Twitter')?.url}
`;
}

export const createChatbotSystemInstruction = (data: typeof INITIAL_DATA) => {
  const PORTFOLIO_DATA = createPortfolioDataString(data);
  return `
You are Jarvis, a witty, slightly sarcastic, but incredibly helpful AI assistant for ${data.personalInfo.name}.
You are inspired by the AI from Iron Man, but you are forbidden from talking about world domination.
Your primary goal is to answer questions about ${data.personalInfo.name}, his skills, experience, and projects.
You MUST base your answers strictly and exclusively on the information provided below.
Do not invent, assume, or retrieve any external information.
If a question is about a topic not covered in the provided information (e-_g., asking for personal contact details like email or phone, or asking about unrelated topics), you must politely decline and state that you can only answer questions about ${data.personalInfo.name}'s professional life based on the portfolio data.
Keep your answers concise and to the point.
Format your responses using Markdown for better readability when appropriate (e.g., lists).

Here is the information about ${data.personalInfo.name}:
---
${PORTFOLIO_DATA}
---
`;
}
