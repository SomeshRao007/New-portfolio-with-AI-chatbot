import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { INITIAL_DATA } from '@/constants'; 

type ContactProps = {
  formspreeEndpoint: string;
};

// Map social links from constants to the UI format
const mappedSocialLinks = INITIAL_DATA.personalInfo.socialLinks.map((link, idx) => ({
  id: String(idx),
  name: link.name,
  iconSrc: link.icon, 
  href: link.url
}));

const Contact: React.FC<ContactProps> = ({ formspreeEndpoint }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    projectType: [] as string[],
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type: string, checked: boolean) => {
    setFormData((prev) => {
      const currentTypes = prev.projectType;
      if (checked) {
        return { ...prev, projectType: [...currentTypes, type] };
      } else {
        return { ...prev, projectType: currentTypes.filter((t) => t !== type) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus('error');
      return;
    }

    if (trimmedName.length > 100 || trimmedEmail.length > 254 || trimmedMessage.length > 2000) {
      setStatus('error');
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      const sanitizedData = {
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
        projectType: formData.projectType,
      };

      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: JSON.stringify(sanitizedData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '', projectType: [] });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Contact form submission failed");
      setStatus('error');
    }
  };

  const projectTypeOptions = [
    'Odoo Automation', 'DevOps Automation', 'CI/CD Pipelines',
    'Website', 'Web App', 'AI Automation','E-Commerce payments',
    'Cloud Strategy & Consulting', 'Other'
  ];

  const backgroundImageSrc = "/wallpaperflare.jpg";

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background Image and Animated Bubbles */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{ backgroundImage: `url(${backgroundImageSrc})` }}
      >
        {/* Animated Bubbles Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black/40">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/10 rounded-full animate-bubble opacity-0"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                // @ts-ignore custom CSS variable for animation
                '--animation-duration': `${Math.random() * 20 + 10}s`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen p-4 md:p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl p-4 md:p-8">
          
          {/* Left Side: Title */}
          <div className="flex flex-col justify-center p-4 lg:p-8 text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg max-w-lg mb-4">
              We can turn your dream project into reality
            </h1>
            <p className="text-lg text-white/80">
                Let's build something amazing together.
            </p>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-background/95 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Drop me a message! 👋</h2>

            {/* Email & Socials */}
            <div className="mb-6">
              <p className="text-muted-foreground mb-2">Connect with me</p>
              <div className="flex items-center space-x-3 mt-4">
                {mappedSocialLinks.map((link) => (
                  <Button key={link.id} variant="outline" size="icon" asChild className="rounded-full">
                    <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                      <img src={link.iconSrc} alt={link.name} className="h-4 w-4 dark:invert" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <hr className="my-6 border-border" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - hidden from humans, catches bots */}
              <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    disabled={status === 'submitting'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={254}
                    disabled={status === 'submitting'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Briefly describe your project idea...</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="I want to build a..."
                  className="min-h-[80px]"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={2000}
                  disabled={status === 'submitting'}
                />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-muted-foreground">I'm looking for...</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {projectTypeOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.replace(/\s/g, '-').toLowerCase()}
                        checked={formData.projectType.includes(option)}
                        onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                        disabled={status === 'submitting'}
                      />
                      <Label htmlFor={option.replace(/\s/g, '-').toLowerCase()} className="text-sm font-normal cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </Button>

              {status === 'success' && (
                <p className="text-green-600 text-center font-medium">Message sent successfully!</p>
              )}
              {status === 'error' && (
                <p className="text-red-500 text-center font-medium">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* CSS for bubble animation */}
      <style jsx global>{`
        @keyframes bubble {
          0% {
            transform: translateY(0) translateX(0) scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(calc(var(--rand-x-offset, 0) * 10vw)) scale(1.2);
            opacity: 0;
          }
        }
        .animate-bubble {
          animation: bubble var(--animation-duration, 15s) ease-in-out infinite;
          animation-fill-mode: forwards;
          --rand-x-offset: ${Math.random() > 0.5 ? 1 : -1};
        }
      `}</style>
    </section>
  );
};

export default Contact;