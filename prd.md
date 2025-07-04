# Product Requirements Document: Premium Calm.com Redesign

## 1. Project Overview

### 1.1 Purpose
Create a pixel-perfect, enhanced clone of Calm.com with premium UI/UX elements. The platform will maintain the wellness and mindfulness focus while incorporating modern design patterns, intuitive interactions, and responsive behaviors for an elevated user experience.

### 1.2 Technology Stack
- **Frontend Framework**: Next.js 15
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn UI
- **Animations**: Framer Motion
- **Additional Libraries**: As needed for specific features (audio playback, meditation timers)

## 2. Header & Navigation Components

### 2.1 Top Navigation Bar
- **Design**: Minimalist, translucent navigation bar that adapts to underlying content
- **Components**:
  - Logo (left-aligned) with subtle animation on hover
  - Primary navigation links with indicator for current section
  - Search icon with expanding search field
  - Login/Sign Up buttons (right-aligned)
  - Try Calm button with subtle highlight effect

### 2.2 Navigation States
- **Transparent**: Initial state on homepage, overlaying hero content
- **Solid**: Appears on scroll or on interior pages
- **Animation**: Smooth transition between states using Framer Motion
- **Mobile**: Collapses to hamburger menu with elegant slide-in panel

### 2.3 User Authentication Area
- **Components**: Log In and Get Started buttons
- **Design**: Primary button for new user conversion, secondary button for returning users
- **Animation**: Subtle hover states with elevation change

## 3. Hero Section

### 3.1 Main Hero Component
- **Layout**: Full-width, immersive video or image background
- **Content**:
  - Primary heading with calming typography
  - Short, impactful tagline about mindfulness
  - CTA button for primary conversion goal
- **Visual**: High-quality, slow-motion nature footage or calming imagery
- **Animation**: Subtle parallax effect on scroll

### 3.2 Dynamic Background
- **Implementation**: Time-of-day aware backgrounds (changes based on user's local time)
- **Options**: Morning, afternoon, evening, and night scenes
- **Animation**: Ultra-slow transitions between scenes
- **Overlay**: Subtle gradient to ensure text readability

## 4. Featured Content Section

### 4.1 Content Categories
- **Design**: Horizontal scrollable cards for different content types
- **Categories**:
  - Sleep Stories
  - Meditation
  - Music
  - Body
  - Masterclass
- **Interaction**: Smooth horizontal scrolling with visible scroll indicators
- **Cards**: Consistent rounded corner treatment with hover elevation

### 4.2 Featured Experience
- **Design**: Large, immersive featured card with background image
- **Content**: Highlighted meditation or sleep story
- **Interaction**: Play button with ripple effect on click
- **Animation**: Subtle breathing animation for the card

### 4.3 Content Card Design
- **Layout**: Image, title, subtitle, duration
- **Hover State**: Slight elevation change and scale increase
- **Accessibility**: Focus states for keyboard navigation
- **Badge**: New content or exclusive content indicators

## 5. Testimonials & Benefits Section

### 5.1 User Testimonials
- **Design**: Clean, card-based testimonials with user images
- **Layout**: Staggered grid or horizontal carousel
- **Animation**: Subtle fade-in on scroll
- **Visual**: High-quality user photos with consistent treatment

### 5.2 Benefits Showcase
- **Layout**: Three-column layout for key benefits
- **Design**: Icon + heading + description format
- **Animation**: Sequential appearance during scroll
- **Icons**: Custom animated icons using Framer Motion

### 5.3 Statistics Display
- **Content**: Key metrics about user benefits (sleep improvement, stress reduction)
- **Design**: Large, emphasized numbers with supporting text
- **Animation**: Counter animation when section enters viewport

## 6. Content Library Section

### 6.1 Browse Categories
- **Layout**: Grid of category cards with thematic imagery
- **Categories**: 
  - Meditation
  - Sleep
  - Music
  - Soundscapes
  - Body
  - Masterclass
- **Design**: Consistent card design with category-specific color accents
- **Animation**: Hover state with scale effect

### 6.2 Recommended Content
- **Implementation**: Horizontally scrollable row of personalized recommendations
- **Algorithm**: Based on time of day and user history (if logged in)
- **Design**: Card format with highlighted "Recommended for you" items
- **Interaction**: Click/tap to expand details

### 6.3 Audio Player Preview
- **Design**: Minimalist audio player for content samples
- **Features**: Play/pause, progress bar, volume control
- **Animation**: Waveform visualization during playback
- **Behavior**: Mini-player that persists during site navigation

## 7. Subscription Offering Section

### 7.1 Pricing Cards
- **Layout**: Side-by-side comparison of free vs premium
- **Design**: Clean cards with distinct visual hierarchy
- **Features**: Bulleted list of included features
- **CTA**: Prominent "Subscribe Now" button with hover animation

### 7.2 Trial Offer
- **Design**: High-visibility section for free trial offer
- **Content**: Clear value proposition and trial terms
- **Animation**: Subtle highlight animation to draw attention
- **CTA**: Low-friction sign-up process with minimal fields

### 7.3 Guarantee Statement
- **Design**: Trust-building element with icon
- **Content**: Money-back guarantee and no-commitment messaging
- **Visual**: Trust badges and security indicators
- **Position**: Directly below pricing to reduce conversion friction

## 8. Community & Results Section

### 8.1 User Success Stories
- **Design**: Immersive, full-width section with background image
- **Content**: Rotating carousel of user success stories
- **Visual**: Authentic user imagery or serene natural backgrounds
- **Animation**: Smooth transitions between stories

### 8.2 Community Stats
- **Design**: Clean, minimal stats display
- **Content**: User base size, minutes meditated, countries represented
- **Animation**: Counter animation on scroll
- **Visual**: Subtle background pattern or illustration

### 8.3 Brand Partnerships
- **Design**: Logo grid of partner organizations or press mentions
- **Layout**: Responsive grid that adapts to screen size
- **Animation**: Subtle opacity changes on hover
- **Style**: Monochromatic treatment for visual cohesion

## 9. Mobile Experience Section

### 9.1 App Showcase
- **Design**: Device mockups showing app interface
- **Animation**: Scrolling screens within device frames
- **Content**: Feature highlights with supporting text
- **Visual**: Clean device frames with drop shadows for depth

### 9.2 Download Section
- **Design**: Clear call-to-action for app downloads
- **Components**: App Store and Google Play buttons
- **Visual**: QR code for direct download
- **Animation**: Hover states for download buttons

### 9.3 Cross-Platform Messaging
- **Content**: Emphasize availability across devices
- **Design**: Icon set representing supported platforms
- **Layout**: Horizontal arrangement with connecting elements
- **Animation**: Sequential fade-in of platform icons

## 10. Footer & Final CTA

### 10.1 Newsletter Signup
- **Design**: Clean, minimal form with inline validation
- **Animation**: Success state animation on submission
- **Content**: Brief value proposition for subscribing
- **Layout**: Horizontal form with button integrated

### 10.2 Footer Navigation
- **Sections**: About, Help, Terms, Privacy, Careers
- **Design**: Organized in logical groups with clear headings
- **Social**: Social media links with hover animations
- **Visual**: Subtle background with calming gradient

### 10.3 Final CTA
- **Design**: Full-width call to action before footer
- **Content**: Compelling final conversion message
- **Animation**: Subtle background animation or parallax
- **Button**: Large, prominent button with hover effect

## 11. Responsive Design Specifications

### 11.1 Breakpoints
- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px - 1440px
- **Large Desktop**: 1441px and above

### 11.2 Mobile Adaptations
- Navigation transforms to bottom tab bar for core functions
- Content cards stack vertically
- Touch-optimized player controls
- Simplified animations for performance

### 11.3 Tablet Adaptations
- Side navigation for content browsing
- Grid layouts reduce to 2 columns
- Optimized touch targets for interface elements
- Adapted player interface for medium screens

## 12. Animation & Interaction Guidelines

### 12.1 Motion Principles
- **Gentle**: All animations should be subtle and calming
- **Purpose**: Motion should enhance, never distract
- **Duration**: Slightly longer durations (300-500ms) for a calming effect
- **Easing**: Custom ease-in-out functions for natural movement

### 12.2 Microinteractions
- Breathing animations for meditation timers
- Nature-inspired motion patterns
- Sound visualization for audio playback
- Subtle page transitions

### 12.3 Loading States
- Custom loading animations reflecting brand identity
- Skeleton screens for content loading
- Progressive image loading with blur-up technique
- Mindful messaging during necessary waits

## 13. Typography System

### 13.1 Font Family
- **Primary**: Circular or Avenir (San serif)
- **Secondary**: Freight Text Pro for testimonials and stories
- **Weights**: 300 (light), 400 (regular), 500 (medium), 700 (bold)

### 13.2 Type Scale
- Display: 48px/56px
- Heading 1: 40px/48px
- Heading 2: 32px/40px
- Heading 3: 24px/32px
- Body: 16px/24px
- Small: 14px/20px
- Caption: 12px/16px

### 13.3 Special Text Treatments
- Subtle text animations for key messages
- Breathing text effect for meditation instructions
- Gradual fade-in for testimonial quotes
- Variable spacing for emphasis

## 14. Color System

### 14.1 Primary Colors
- **Deep Blue**: #1A2C50 (primary backgrounds, night mode)
- **Calm Teal**: #07A79B (primary actions, accents)
- **Sky Blue**: #73C2FB (secondary accents, morning content)

### 14.2 Secondary Colors
- **Sunset Orange**: #FF7B52
- **Lavender**: #A88BEB
- **Sand**: #E8D7B6

### 14.3 Neutral Colors
- **Near Black**: #171F2A (text)
- **Dark Gray**: #434C59 (secondary text)
- **Mid Gray**: #8895A7 (tertiary text, icons)
- **Light Gray**: #DFE6F0 (borders, dividers)
- **Off White**: #F8FAFD (backgrounds)

### 14.4 Gradients
- **Sunrise**: Linear blend from #FFD4B8 to #FFA987
- **Daytime**: Linear blend from #73C2FB to #3AA8E0
- **Sunset**: Linear blend from #FF7B52 to #E85C41
- **Night**: Linear blend from #1A2C50 to #0F1B34

## 15. Component Library Extensions

### 15.1 Custom shadcn UI Components
- Custom audio player with visualization
- Meditation timer with visual feedback
- Progress indicators for courses and programs
- Content cards with consistent styling

### 15.2 Interactive Components
- Breathe bubble animation for guided breathing
- Sleep story player with dimming interface
- Customizable ambient sound mixer
- Mood tracker with visual feedback

### 15.3 Form Components
- Streamlined signup flow
- Preference selectors with visual options
- Rating inputs with animated feedback
- Minimal input fields with floating labels

## 16. Implementation Priorities

### 16.1 Phase 1 - Core Structure
- Homepage with key sections
- Navigation and basic interaction
- Content browsing functionality
- Responsive framework implementation

### 16.2 Phase 2 - Content Experience
- Audio player implementation
- Content recommendation system
- User accounts and preferences
- Meditation timer functionality

### 16.3 Phase 3 - Enhancement
- Advanced animations and transitions
- Personalization features
- Performance optimization
- Cross-platform testing

## 17. Performance Requirements

### 17.1 Load Time Targets
- First Contentful Paint: < 1.2s
- Time to Interactive: < 2.8s
- Largest Contentful Paint: < 2.2s

### 17.2 Media Optimization
- Adaptive streaming for audio content
- Progressive loading for background videos
- Image optimization with Next.js Image component
- WebP format with fallbacks

### 17.3 Monitoring Plan
- Core Web Vitals tracking
- User journey analytics
- Error tracking and reporting
- Performance budget enforcement

## 18. Audio Experience Requirements

### 18.1 Player Functionality
- Background audio playback
- Seamless looping for ambient sounds
- Mixing capabilities for sound layering
- Offline playback capability for premium users

### 18.2 Audio Quality
- High-quality audio encoding (minimum 128kbps AAC)
- Adaptive bitrate based on connection speed
- Spatial audio support where applicable
- Volume normalization across content

### 18.3 Audio Interface
- Minimalist controls that appear when needed
- Timeline visualization with preview capability
- Favorites and history integration
- Sleep timer with gentle fade-out

## 19. Accessibility Standards

### 19.1 Compliance Targets
- WCAG 2.1 AA compliance
- Screen reader friendly navigation
- Keyboard accessibility throughout
- Captions for video content

### 19.2 Mindfulness-Specific Considerations
- Alternative text descriptions for meditation visuals
- Transcript availability for guided content
- Adjustable meditation timing for different abilities
- Multiple meditation styles for different needs

## 20. Content Personalization

### 20.1 User Preferences
- Time of day preferences
- Content duration preferences
- Voice guide preferences
- Goal setting and tracking

### 20.2 Recommendation Engine
- Algorithm based on usage patterns
- Time-aware suggestions
- Mood-based recommendations
- Progressive difficulty for meditation practices

### 20.3 User Journey
- Onboarding flow to gather initial preferences
- Gradual introduction of features to prevent overwhelm
- Milestone celebrations for engagement
- Personalized check-ins and reminders

## 21. Browser & Device Support

### 21.1 Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### 21.2 Device Support
- Desktop (Windows, macOS)
- Tablet (iOS, Android)
- Mobile (iOS, Android)
- Smart displays where applicable

### 21.3 Progressive Enhancement
- Core functionality on all supported platforms
- Enhanced experiences on capable browsers
- Fallbacks for older browsers
- Offline capabilities for premium users

This comprehensive PRD provides detailed specifications for creating a premium, enhanced version of Calm.com using modern web technologies. The document covers all visual aspects, interactive elements, content requirements, and technical specifications needed to implement a meditation and wellness platform with Next.js 15, Tailwind 4, shadcn UI, and Framer Motion.