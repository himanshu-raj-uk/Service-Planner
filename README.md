[README.md](https://github.com/user-attachments/files/32854972/README.md)
# Service Planner

<div align="center">

**AI-Powered Planning for Travel, Birthdays, Weddings, Events & More**

*Describe what you want. Get a personalized plan. Refine it. Manage it.*

</div>

> [!NOTE]
> **Documentation scope:** This README describes the Service Planner product vision, planning workflows, UX principles, architecture guidance, and future capabilities. Where the document explicitly says that something should follow the current source code, that statement remains the source of truth for the implemented application.

---

> **Service Planner** is an AI-powered, user-friendly planning platform designed to help people plan travel, birthdays, weddings, events, celebrations, and other personalized experiences from one place.

**The core idea is simple:**

**Tell Service Planner what you want. The AI understands your needs, builds a practical plan, and helps you manage it.**

The platform is designed around real human planning rather than simply generating generic lists. A user should be able to describe what they want in natural language, provide a budget and preferences, and receive a plan that is realistic, personalized, understandable, and easy to modify.

---

## 📚 Table of Contents

- [1. Vision](#1-vision)
- [2. What Service Planner Does](#2-what-service-planner-does)
- [3. The Core Experience](#3-the-core-experience)
- [4. AI-Powered Planning](#4-ai-powered-planning)
- [5. Traveller-First Philosophy](#5-traveller-first-philosophy)
- [6. Planning Categories](#6-planning-categories)
- [7. Travel Planning](#7-travel-planning)
- [8. Birthday Planning](#8-birthday-planning)
- [9. Wedding Planning](#9-wedding-planning)
- [10. Event Planning](#10-event-planning)
- [11. Celebration Planning](#11-celebration-planning)
- [12. More Planning Experiences](#12-more-planning-experiences)
- [13. Universal Planning Workflow](#13-universal-planning-workflow)
- [14. AI Understanding Layer](#14-ai-understanding-layer)
- [15. Personalization](#15-personalization)
- [16. Budget-Aware Planning](#16-budget-aware-planning)
- [17. People and Guest Planning](#17-people-and-guest-planning)
- [18. Location-Aware Planning](#18-location-aware-planning)
- [19. Plan Generation](#19-plan-generation)
- [20. Plan Refinement](#20-plan-refinement)
- [21. Plan Management](#21-plan-management)
- [22. Confirmation Management](#22-confirmation-management)
- [23. Notifications](#23-notifications)
- [24. Support](#24-support)
- [25. User Experience](#25-user-experience)
- [26. Navigation](#26-navigation)
- [27. Responsive Design](#27-responsive-design)
- [28. Light and Dark Themes](#28-light-and-dark-themes)
- [29. Frontend Architecture](#29-frontend-architecture)
- [30. Application Data Flow](#30-application-data-flow)
- [31. AI Data Flow](#31-ai-data-flow)
- [32. Travel Data Flow](#32-travel-data-flow)
- [33. Event Data Flow](#33-event-data-flow)
- [34. Forms](#34-forms)
- [35. Location Workflow](#35-location-workflow)
- [36. API Integration](#36-api-integration)
- [37. Security](#37-security)
- [38. Privacy](#38-privacy)
- [39. Accessibility](#39-accessibility)
- [40. UI Engineering Rules](#40-ui-engineering-rules)
- [41. Code Maintenance Rules](#41-code-maintenance-rules)
- [42. Suggested Project Structure](#42-suggested-project-structure)
- [43. Development Workflow](#43-development-workflow)
- [44. Testing Strategy](#44-testing-strategy)
- [45. Product QA Checklist](#45-product-qa-checklist)
- [46. Future AI Capabilities](#46-future-ai-capabilities)
- [47. Future Planning Categories](#47-future-planning-categories)
- [48. Product Principles](#48-product-principles)
- [49. Current Documentation Status](#49-current-documentation-status)
- [50. License](#50-license)

> **Reading the document:** Sections **1–24** describe the planning product and AI experience. Sections **25–28** describe the user interface and responsive/theme experience. Sections **29–45** cover engineering, architecture, security, accessibility, development, and QA. Sections **46–50** cover future capabilities, product principles, documentation status, and licensing.

---


---

## 1. Vision

Service Planner is intended to become a single planning experience for everyday people who need help organizing something important.

Instead of making users search through many websites, apps, notes, spreadsheets, messages, and booking pages, Service Planner brings the planning process into one guided experience.

**The user describes the goal.**

**The AI understands the goal.**

**The platform turns the goal into a plan.**

**The user can then review, change, confirm, and manage that plan.**

#### Vision

```text
Human idea
    ↓
Service Planner
    ↓
AI understands the requirement
    ↓
Personalized plan
    ↓
User reviews
    ↓
AI refines
    ↓
Final plan
    ↓
Manage + confirm + receive updates
```

---


---

## 2. What Service Planner Does

Service Planner is designed to support planning for:

- Trips
- Vacations
- Birthdays
- Weddings
- Parties
- Corporate events
- Family events
- Celebrations
- Gatherings
- Experiences
- Special occasions
- Other customized planning requirements

The exact categories implemented in the current application should always follow the source code.

The broader product architecture is intentionally designed so that new planning categories can be added without rebuilding the entire platform.

---


---

## 3. The Core Experience

The most important Service Planner interaction is:

> **Tell us what you want.**

A user should not have to understand complicated planning terminology.

For example:

```text
"I want a 5-day trip to Goa for 4 friends.
We have around ₹50,000.
We like beaches, local food and nightlife,
but we don't want a very busy schedule."
```

Service Planner should transform that requirement into structured planning information.

```text
Trip Type
    ↓
Destination
    ↓
Duration
    ↓
Travellers
    ↓
Budget
    ↓
Interests
    ↓
Food Preferences
    ↓
Activity Preferences
    ↓
Pace
    ↓
Requirements
```

Then the AI creates a plan around those needs.

---


---

## 4. AI-Powered Planning

AI is the central planning layer of Service Planner.

The AI should not only generate text.

It should help convert an unclear human request into a structured and actionable plan.

#### AI responsibilities

```text
Understand
    ↓
Extract
    ↓
Organize
    ↓
Personalize
    ↓
Plan
    ↓
Explain
    ↓
Refine
```

#### AI should understand

- What the user wants
- Why the user is planning
- Who is involved
- Where it is happening
- When it is happening
- How much the user wants to spend
- What the user likes
- What the user dislikes
- What constraints exist
- What level of comfort is expected
- What requirements are important

---


---

## 5. Traveller-First Philosophy

Travel planning is one of the strongest examples of the Service Planner experience.

The platform should be designed around the traveller rather than around a generic destination list.

A useful travel plan should consider:

- Traveller personality
- Travel pace
- Budget
- Interests
- Food preferences
- Accommodation preferences
- Transport preferences
- Group size
- Activity preferences
- Rest requirements
- Special requirements
- Local experience preferences

#### Example

A generic itinerary may say:

```text
Day 1:
Visit Place A
Visit Place B
Visit Place C
Visit Place D
```

A traveller-first plan should instead communicate:

```text
Morning
Easy start and breakfast nearby

Late morning
One major attraction based on your interests

Afternoon
Lunch + rest

Evening
Local experience

Night
Optional activity depending on energy and budget
```

The objective is to make the plan feel usable in real life.

---


---

## 6. Planning Categories

Service Planner can be structured around a common planning engine with specialized planning experiences.

```text
                         SERVICE PLANNER
                               |
        +----------------------+----------------------+
        |                      |                      |
      Travel              Celebrations             Events
        |                      |                      |
   +----+----+          +------+-------+       +------+------+
   |         |          |              |       |             |
Trips     Vacations   Birthday      Wedding  Corporate    Party
                                               |
                                               +-- Family
                                               +-- Social
```

All planning types can share the same core:

```text
Requirements
     ↓
People
     ↓
Budget
     ↓
Location
     ↓
Preferences
     ↓
AI Planning
     ↓
Plan
     ↓
Management
```

---


---

## 7. Travel Planning

Travel planning is designed for people who want a personalized and practical trip.

### Travel inputs

Potential inputs include:

- Destination
- Starting location
- Travel dates
- Duration
- Number of travellers
- Traveller type
- Budget
- Accommodation preferences
- Food preferences
- Activity preferences
- Transport preferences
- Interests
- Trip pace
- Special requirements

### Traveller types

The system can support different planning contexts such as:

- Solo traveller
- Couple
- Friends
- Family
- Group
- Business traveller

The exact available options should follow the implemented UI.

### Travel plan output

A generated travel plan can contain:

```text
Trip Summary
    ↓
Dates
    ↓
Destination
    ↓
Traveller Summary
    ↓
Budget Summary
    ↓
Accommodation
    ↓
Transportation
    ↓
Daily Itinerary
    ↓
Food Suggestions
    ↓
Activities
    ↓
Estimated Costs
    ↓
Practical Tips
```

---


---

## 8. Birthday Planning

Birthday planning provides a dedicated experience for organizing a birthday.

A birthday plan may consider:

- Birthday person
- Age group
- Date
- Location
- Number of guests
- Budget
- Theme
- Food
- Decorations
- Activities
- Entertainment
- Special requirements

The birthday workflow should remain user-friendly and should not require the user to manually understand every service involved.

#### Birthday flow

```text
Birthday
   ↓
Basic Details
   ↓
Location
   ↓
Guests
   ↓
Budget
   ↓
Preferences
   ↓
Theme / Experience
   ↓
AI Plan
   ↓
Review
   ↓
Modify
   ↓
Confirm
```

The current project material confirms that the Birthday implementation contains existing UI, form logic, API logic, and location logic. Those existing behaviors should remain protected during UI-only changes.

---


---

## 9. Wedding Planning

Wedding planning is a larger multi-part planning experience.

A wedding plan can be organized into multiple areas:

```text
Wedding
 |
 +-- Couple
 |
 +-- Date
 |
 +-- Location
 |
 +-- Guest Count
 |
 +-- Budget
 |
 +-- Venue
 |
 +-- Food
 |
 +-- Decoration
 |
 +-- Photography
 |
 +-- Entertainment
 |
 +-- Invitations
 |
 +-- Transportation
 |
 +-- Accommodation
 |
 +-- Timeline
 |
 +-- Special Requirements
```

#### AI wedding workflow

```text
Wedding idea
     ↓
Understand couple preferences
     ↓
Understand budget
     ↓
Understand guest requirements
     ↓
Understand location
     ↓
Break wedding into services
     ↓
Build timeline
     ↓
Create budget structure
     ↓
Create personalized plan
     ↓
Allow refinement
```

The actual services exposed by the application should be driven by the implemented product.

---


---

## 10. Event Planning

Service Planner can provide a generalized event-planning workflow.

Examples include:

- Parties
- Corporate events
- Family gatherings
- Social events
- Community events
- Celebrations
- Private events
- Other custom occasions

#### Event inputs

```text
Event Type
Date
Time
Location
Guests
Budget
Purpose
Theme
Food
Entertainment
Decoration
Transportation
Special Requirements
```

#### Event planning output

```text
Event Overview
     ↓
Venue / Location
     ↓
Guest Plan
     ↓
Schedule
     ↓
Food
     ↓
Activities
     ↓
Entertainment
     ↓
Decoration
     ↓
Estimated Budget
     ↓
Checklist
     ↓
Confirmation Tracker
```

---


---

## 11. Celebration Planning

Not every important occasion fits into a fixed category.

Service Planner should therefore support flexible celebration planning.

Example:

```text
"I want to organize a small family celebration
for 20 people with a ₹30,000 budget."
```

The AI can identify that this is a celebration and ask only the questions required to build the plan.

This creates a more natural experience than forcing users to select a highly specific category first.

---


---

## 12. More Planning Experiences

The architecture can support additional planning categories such as:

- Anniversary planning
- Proposal planning
- Family functions
- Graduation celebrations
- Reunions
- Corporate offsites
- Team events
- Retreats
- Festival celebrations
- Surprise events
- Weekend getaways
- Group trips
- Honeymoon planning
- Custom experiences

These should be treated as potential product extensions unless implemented in the application.

---


---

## 13. Universal Planning Workflow

Every planning type should follow a common lifecycle.

```text
                         USER
                           |
                           v
                  Describe the goal
                           |
                           v
                  Select / identify
                  planning category
                           |
                           v
                Collect requirements
                           |
                           v
               Understand preferences
                           |
                           v
                 Understand budget
                           |
                           v
                Understand location
                           |
                           v
                 Understand people
                           |
                           v
                    AI analysis
                           |
                           v
                  Generate plan
                           |
                           v
                    User review
                           |
                    +------+------+
                    |             |
                  Change         Accept
                    |             |
                    v             v
                AI refine      Final plan
                    |             |
                    +------>------+
                                  |
                                  v
                           Manage plan
                                  |
                                  v
                       Confirm / track
                                  |
                                  v
                         Notifications
                                  |
                                  v
                              Support
```

---


---

## 14. AI Understanding Layer

The AI planning engine should transform natural language into structured information.

Example:

```text
User:
"I want a romantic 4-day trip to Jaipur
with my partner, around ₹35,000.
We love food, heritage places and photography,
but don't want early mornings."
```

The AI can extract:

```json
{
  "type": "travel",
  "destination": "Jaipur",
  "duration": "4 days",
  "travellers": 2,
  "relationship": "couple",
  "budget": 35000,
  "interests": [
    "food",
    "heritage",
    "photography"
  ],
  "pace": "relaxed",
  "constraints": [
    "avoid early mornings"
  ]
}
```

The exact schema should match the actual backend implementation.

---


---

## 15. Personalization

Personalization is a central part of Service Planner.

The platform should avoid giving every user the same plan.

#### Personalization dimensions

```text
Budget
   +
Location
   +
People
   +
Preferences
   +
Requirements
   +
Time
   +
Purpose
   +
Comfort
   +
Interests
   ↓
Personalized Plan
```

A plan should explain relevant decisions in user-friendly language.

---


---

## 16. Budget-Aware Planning

Budget should be treated as a planning constraint, not simply displayed as a number.

For travel:

```text
Total Budget
 |
 +-- Transportation
 |
 +-- Accommodation
 |
 +-- Food
 |
 +-- Activities
 |
 +-- Local Travel
 |
 +-- Extra / Emergency
```

For events:

```text
Event Budget
 |
 +-- Venue
 |
 +-- Food
 |
 +-- Decoration
 |
 +-- Entertainment
 |
 +-- Photography
 |
 +-- Transportation
 |
 +-- Other
```

The exact categories should be determined by the actual plan type and implementation.

#### Budget experience

The user should be able to understand:

- Estimated total
- Major cost areas
- Remaining budget
- Optional expenses
- Where trade-offs may be required

---


---

## 17. People and Guest Planning

People are a major part of planning.

The platform should account for:

- Number of people
- Group type
- Guest count
- Traveller count
- Age groups where relevant
- Special requirements where relevant

For an event:

```text
Event
 ↓
Guest Count
 ↓
Guest Requirements
 ↓
Venue Capacity
 ↓
Food Requirements
 ↓
Seating / Experience
```

For travel:

```text
Trip
 ↓
Travellers
 ↓
Traveller Preferences
 ↓
Transport
 ↓
Accommodation
 ↓
Activities
```

---


---

## 18. Location-Aware Planning

Location can influence the entire plan.

The location workflow may include:

```text
Location
   ↓
Area / Destination
   ↓
Available services / experiences
   ↓
Travel distance
   ↓
Timing
   ↓
Plan structure
```

The existing Birthday implementation already contains location logic, so future UI changes must preserve that behavior unless location functionality itself is being changed.

---


---

## 19. Plan Generation

A generated plan should be more than a paragraph of AI text.

The plan should be structured so users can act on it.

#### Example plan structure

```text
PLAN
 |
 +-- Overview
 |
 +-- Why this plan fits you
 |
 +-- Budget
 |
 +-- Schedule
 |
 +-- Services
 |
 +-- Locations
 |
 +-- People
 |
 +-- Tasks
 |
 +-- Confirmations
 |
 +-- Notifications
 |
 +-- Alternatives
```

For travel, the schedule can become day-by-day.

For weddings/events, it can become service-by-service and timeline-based.

---


---

## 20. Plan Refinement

AI planning should be iterative.

The user should be able to say:

```text
"Make it cheaper."

"Add more local food."

"Remove the nightlife."

"Make the trip more relaxed."

"Add activities for children."

"Make the wedding more traditional."

"Reduce the guest experience cost."

"Move everything closer to the venue."
```

The AI should modify the plan while preserving requirements that the user did not ask to change.

#### Refinement principle

```text
Existing Plan
     +
User Change
     ↓
AI Understands Change
     ↓
Recalculate Relevant Parts
     ↓
Updated Plan
```

---


---

## 21. Plan Management

Once created, a plan becomes a persistent planning workspace.

A plan-management screen can contain:

```text
Plan
 |
 +-- Overview
 +-- Schedule
 +-- Budget
 +-- People
 +-- Services
 +-- Tasks
 +-- Confirmations
 +-- Notifications
 +-- Support
```

The user should not have to recreate a plan just because they want to change one part of it.

---


---

## 22. Confirmation Management

Planning often involves multiple services.

For example, a wedding may involve:

```text
Venue
Food
Decoration
Photography
Entertainment
Transportation
Accommodation
```

The application can represent confirmation progress:

```text
Service
   |
   +-- Pending
   +-- Confirmed
   +-- Needs Attention
```

For travel:

```text
Transport
Accommodation
Activities
```

The exact statuses should follow the application's implementation.

---


---

## 23. Notifications

Notifications should help users stay aware of important plan changes.

Possible notification categories include:

- Plan generated
- Plan updated
- Confirmation changed
- Reminder
- Important requirement
- Support update

Notifications should be useful rather than overwhelming.

---


---

## 24. Support

Service Planner should provide support throughout the planning lifecycle.

```text
Create
  ↓
Plan
  ↓
Review
  ↓
Manage
  ↓
Confirm
  ↓
Travel / Event
  ↓
Support
```

Support can eventually include:

- Help center
- AI assistance
- Human support
- Planning guidance
- Issue reporting

Only implemented support functionality should be presented as currently available.

---


---

## 25. User Experience

### 🎨 UI / Design System Reference

> **Source-of-truth rule:** The visual system should be extracted from the actual Service Planner source when exact values are required. Do not invent font families, color hex values, spacing tokens, or component measurements and present them as current implementation details.

For implementation work, the design reference should document:

- **Typography:** font family, size scale, weights, line heights, and responsive adjustments.
- **Color system:** page background, surfaces, text, muted text, borders, accents, success/warning/error states, and interactive states.
- **Themes:** light and dark theme tokens and component behavior.
- **Components:** navigation, buttons, inputs, dropdowns, cards, dialogs, notifications, AI planning surfaces, and plan sections.
- **Layout:** container widths, spacing scale, grid/flex patterns, alignment, and responsive breakpoints.
- **Visual patterns:** border radius, shadows, separators, icon sizing, focus states, hover states, loading states, and empty states.

This keeps the README useful as a product specification without claiming visual values that have not been verified from the application's source.


The most important UX principle is:

> **Complex planning should feel simple.**

The user should not need to understand:

- Internal APIs
- Database structures
- Service-provider terminology
- AI prompts
- Planning algorithms
- Technical configuration

The application should convert complexity into simple decisions.

#### UX pattern

```text
Complex internal system
          ↓
Simple user questions
          ↓
Personalized AI plan
```

---


---

## 26. Navigation

The main navigation should make planning categories easy to discover.

A scalable navigation model can be:

```text
Service Planner
 |
 +-- Home
 |
 +-- Plan Something
 |     |
 |     +-- Travel
 |     +-- Birthday
 |     +-- Wedding
 |     +-- Event
 |     +-- Celebration
 |     +-- Custom
 |
 +-- My Plans
 |
 +-- Notifications
 |
 +-- Support
 |
 +-- Profile
 |
 +-- Logout
```

The exact route names and navigation labels must remain consistent with the current source code.

---


---

## 27. Responsive Design

Service Planner should provide a consistent experience across:

- Desktop
- Laptop
- Tablet
- Mobile

#### Desktop

```text
Navigation + Main Content + Supporting Information
```

#### Tablet

```text
Condensed Navigation
Flexible Content
```

#### Mobile

```text
Compact Navigation
Single-column content
Touch-friendly controls
Scrollable sections
```

The responsive layout should preserve the user's ability to complete the planning workflow.

---


---

## 28. Light and Dark Themes

The UI should support consistent light and dark experiences.

Theme-aware areas include:

- Navigation
- Cards
- Forms
- Inputs
- Dropdowns
- Buttons
- Borders
- Text
- Backgrounds
- Scrollbars
- Hover states
- Focus states

Theme changes should not alter business logic.

---


---

## 29. Frontend Architecture

The application should use reusable components so that Travel, Birthday, Wedding, Event, and future planners can share common UI behavior.

Conceptually:

```text
Application
 |
 +-- Layout
 |
 +-- Navigation
 |
 +-- Planning Engine UI
 |      |
 |      +-- Travel Form
 |      +-- Birthday Form
 |      +-- Wedding Form
 |      +-- Event Form
 |      +-- Custom Planner
 |
 +-- Plan UI
 |
 +-- Budget UI
 |
 +-- People UI
 |
 +-- Location UI
 |
 +-- Confirmation UI
 |
 +-- Notification UI
 |
 +-- Support UI
```

The actual framework and directory structure should be taken from the repository.

---


---

## 30. Application Data Flow

The general application flow is:

```text
User
 ↓
UI
 ↓
Local State
 ↓
Validation
 ↓
API
 ↓
Backend
 ↓
AI / Planning Logic
 ↓
Response
 ↓
Application State
 ↓
UI
```

The UI should remain responsible for presenting the information clearly while the backend remains responsible for protected business logic and services.

---


---

## 31. AI Data Flow

```text
User Request
     ↓
Natural Language
     ↓
Requirement Extraction
     ↓
Structured Planning Data
     ↓
Context + Preferences
     ↓
AI Planning
     ↓
Validation / Business Rules
     ↓
Generated Plan
     ↓
User Review
     ↓
AI Refinement
```

The exact AI provider, model, prompts, and backend architecture are not specified by the available project material.

---


---

## 32. Travel Data Flow

```text
Traveller
    ↓
Travel Request
    ↓
Destination
    ↓
Dates
    ↓
Travellers
    ↓
Budget
    ↓
Preferences
    ↓
Interests
    ↓
AI
    ↓
Itinerary
    ↓
Budget
    ↓
Transport
    ↓
Accommodation
    ↓
Activities
    ↓
Traveller Review
    ↓
Refinement
```

---


---

## 33. Event Data Flow

```text
Event Request
    ↓
Event Type
    ↓
Date / Time
    ↓
Location
    ↓
Guests
    ↓
Budget
    ↓
Theme / Purpose
    ↓
Requirements
    ↓
AI
    ↓
Event Plan
    ↓
Timeline
    ↓
Services
    ↓
Budget
    ↓
Confirmation
```

The same architecture can support birthdays, weddings, parties, corporate events, and other celebrations.

---


---

## 34. Forms

Forms are one of the most important interfaces in Service Planner.

A good planning form should:

- Ask only relevant questions.
- Explain why important information is needed.
- Group related fields.
- Provide clear validation.
- Preserve entered information.
- Show loading states.
- Show useful errors.
- Work on mobile.
- Support theme changes.

#### Adaptive form concept

Instead of showing every possible question:

```text
User chooses Wedding
       ↓
Wedding-specific questions
```

Instead of:

```text
User chooses Travel
       ↓
Travel-specific questions
```

This keeps the experience simple.

---


---

## 35. Location Workflow

Location can be provided through the application's existing location UI.

A location-aware planner may use:

```text
User Location
     ↓
Destination / Event Location
     ↓
Relevant planning context
     ↓
Plan
```

Location behavior must remain consistent with the existing implementation.

The supplied project material specifically documents existing location logic in `Birthday.tsx`.

---


---

## 36. API Integration

The application can use APIs for:

- Authentication
- Planning
- AI processing
- Location
- Plans
- Notifications
- Support
- Other services

The exact API endpoints and payloads are not documented in the supplied material.

#### API principle

A UI-only change should not modify:

- API endpoint
- HTTP method
- Request payload
- Response parsing
- Error handling
- Authentication
- Existing state transitions

unless the requested task specifically requires it.

---


---

## 37. Security

Service Planner should be built with security as a core requirement.

#### Security principles

- Never expose private API keys in frontend code.
- Protect user-specific data.
- Validate API input.
- Validate permissions.
- Protect authenticated routes.
- Do not trust client-side validation alone.
- Avoid exposing sensitive information in errors.
- Keep secrets in environment configuration.
- Use secure production deployment practices.

---


---

## 38. Privacy

Planning may involve personal information.

Potentially sensitive planning data can include:

- Location
- Travel details
- Guest information
- Event information
- Preferences
- Contact information
- Budget information

The application should collect only information required for the requested experience and handle it according to the project's privacy and security requirements.

---


---

## 39. Accessibility

The application should be usable by as many people as possible.

#### Accessibility requirements

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Clear labels
- Accessible form errors
- Sufficient text contrast
- Meaningful button names
- Appropriate touch target sizes
- Do not rely only on color for status
- Responsive text
- Usable dropdowns

---


---

## 40. UI Engineering Rules

Service Planner UI work should follow these principles:

#### 1. Preserve existing UI

Do not redesign unrelated parts of a page.

#### 2. Make changes locally

If a user asks to change a scrollbar, change the scrollbar rather than rewriting the page.

#### 3. Preserve application logic

Do not alter business logic during visual changes.

#### 4. Preserve forms

Do not change form behavior unless the requirement specifically concerns the form.

#### 5. Preserve APIs

Do not modify API behavior for unrelated visual changes.

#### 6. Preserve location logic

Do not modify location behavior when implementing unrelated UI changes.

#### 7. Maintain responsiveness

Every UI change should be checked on small and large screens.

#### 8. Maintain theme support

Every visual change should work in light and dark modes.

---


---

## 41. Code Maintenance Rules

Before modifying an existing component:

```text
Read complete component
        ↓
Understand imports
        ↓
Understand state
        ↓
Understand handlers
        ↓
Understand API calls
        ↓
Understand location logic
        ↓
Understand rendering
        ↓
Understand styling
        ↓
Make requested change
        ↓
Review complete file
```

Avoid unnecessary rewrites.

A small UI requirement should result in a small, targeted code change.

---


---

## 42. Suggested Project Structure

This is a scalable conceptual structure, not a claim about the exact current repository.

```text
Service-Planner/
│
├── README.md
├── package.json
├── .env.example
├── .gitignore
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── forms/
│   │   ├── planner/
│   │   ├── plans/
│   │   ├── budget/
│   │   ├── people/
│   │   ├── location/
│   │   ├── notifications/
│   │   └── support/
│   │
│   ├── pages/
│   │   ├── home/
│   │   ├── travel/
│   │   ├── birthday/
│   │   ├── wedding/
│   │   ├── events/
│   │   ├── plans/
│   │   └── support/
│   │
│   ├── services/
│   │   ├── api/
│   │   ├── ai/
│   │   └── location/
│   │
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   └── App.*
│
└── ...
```

---


---

## 43. Development Workflow

The recommended development process is:

### Step 1 — Understand the requirement

Determine whether the task is:

- UI
- Responsive UI
- Theme
- Form
- API
- AI
- Location
- Navigation
- Planning logic
- Data management

### Step 2 — Inspect existing code

Read the relevant component before modifying it.

### Step 3 — Identify dependencies

Understand:

- State
- Props
- API calls
- Event handlers
- Location logic
- Styling
- Conditional rendering

### Step 4 — Implement the smallest correct change

Avoid unrelated refactoring.

### Step 5 — Verify functionality

Check the complete affected workflow.

### Step 6 — Verify UI

Check:

- Desktop
- Tablet
- Mobile
- Light theme
- Dark theme

### Step 7 — Review changes

Make sure unrelated functionality was not changed.

---


---

## 44. Testing Strategy

Testing should cover both planning logic and user experience.

### Functional

- [ ] Application loads.
- [ ] Navigation works.
- [ ] Planner categories open.
- [ ] Travel workflow works.
- [ ] Birthday workflow works.
- [ ] Wedding workflow works when implemented.
- [ ] Event workflow works when implemented.
- [ ] Forms validate.
- [ ] API requests work.
- [ ] Errors are handled.
- [ ] Location works.
- [ ] Plans are displayed.
- [ ] Plans can be managed.
- [ ] Confirmation status works.
- [ ] Notifications work.
- [ ] Support works.

### AI

- [ ] Natural-language requirements can be processed.
- [ ] Required information is identified.
- [ ] User preferences affect the plan.
- [ ] Budget affects the plan.
- [ ] People/guest information affects the plan.
- [ ] User refinement requests are preserved.
- [ ] AI does not silently remove important constraints.

---


---

## 45. Product QA Checklist

### Planning

- [ ] User understands what to do.
- [ ] User can start planning quickly.
- [ ] Questions are relevant.
- [ ] User can review the plan.
- [ ] User can request changes.
- [ ] Plan remains understandable.

### Travel

- [ ] Destination visible.
- [ ] Dates visible.
- [ ] Traveller count visible.
- [ ] Budget visible.
- [ ] Itinerary readable.
- [ ] Activities understandable.
- [ ] Rest/travel time considered where applicable.

### Events

- [ ] Event type visible.
- [ ] Guest count visible.
- [ ] Date/time visible.
- [ ] Location visible.
- [ ] Budget visible.
- [ ] Services organized.
- [ ] Timeline understandable.

### UI

- [ ] No layout overflow.
- [ ] No broken navigation.
- [ ] No text clipping.
- [ ] Forms work.
- [ ] Dropdowns work.
- [ ] Scrollbars work.
- [ ] Light theme works.
- [ ] Dark theme works.
- [ ] Mobile layout works.

---


---

## 46. Future AI Capabilities

The platform can evolve from an AI plan generator into an AI planning assistant.

Potential capabilities include:

### Conversational planning

```text
User:
"Make my trip cheaper."

AI:
"Which part would you prefer to reduce:
hotel, transport, or activities?"
```

### Context preservation

The AI should remember relevant requirements inside the current planning workflow.

### Plan comparison

```text
Plan A
Comfort focused

Plan B
Budget focused

Plan C
Experience focused
```

### Intelligent refinement

The user can modify one requirement without rebuilding everything.

### Explainable recommendations

The AI can explain why a particular part of the plan fits the user's stated requirements.

These are product directions rather than claims that every capability is currently implemented.

---


---

## 47. Future Planning Categories

Service Planner can grow into a general-purpose planning platform.

Potential categories include:

```text
TRAVEL
 ├── Vacation
 ├── Weekend Trip
 ├── Group Trip
 ├── Honeymoon
 ├── Road Trip
 └── Business Trip

CELEBRATION
 ├── Birthday
 ├── Anniversary
 ├── Proposal
 ├── Graduation
 └── Family Celebration

EVENTS
 ├── Wedding
 ├── Party
 ├── Corporate Event
 ├── Conference
 ├── Meetup
 └── Retreat

CUSTOM
 └── Anything the user wants to plan
```

The goal is not to create dozens of disconnected products.

The goal is:

> **One planning engine with many specialized experiences.**

---


---

## 48. Product Principles

### Principle 1 — Human first

The user should never need to understand the technical system.

### Principle 2 — AI should reduce work

AI should make planning easier, not create another complicated interface.

### Principle 3 — Real-world practicality

Plans should be understandable and realistic for the user's stated constraints.

### Principle 4 — Personalization

The same destination or event should not automatically produce the same experience for every user.

### Principle 5 — User control

The user should be able to review, change, reject, and refine a plan.

### Principle 6 — Transparency

Important assumptions and estimated costs should be understandable.

### Principle 7 — Simple UI

Complex backend logic should result in simple frontend interactions.

### Principle 8 — Preserve existing functionality

UI improvements should not accidentally break forms, APIs, location workflows, or existing business logic.

### Principle 9 — Responsive everywhere

The planning experience should work across devices.

### Principle 10 — One platform

Travel, birthdays, weddings, events, and future categories should share a common planning foundation.

---


---

## 49. Current Documentation Status

This README combines the Service Planner product direction supplied in the project description with a broader scalable planning model for travel, birthdays, weddings, events, celebrations, and custom planning.

#### Confirmed from the supplied project material

The existing project material confirms that the Birthday implementation includes:

- Existing UI
- Form logic
- API logic
- Location logic

It also documents a scrollbar update that preserved those behaviors while adding:

- Dark/light scrollbar styling
- A wider track area
- A narrow centered thumb
- Rounded thumb styling
- Hover states
- Shared page and dropdown scrollbar styling. fileciteturn0file0L3-L11

#### Product requirements established in this project

Service Planner is intended to provide:

- AI-powered planning
- User-friendly planning
- Travel planning
- Birthday planning
- Wedding planning
- Event planning
- More customizable planning categories
- Budget-aware planning
- Preference-aware planning
- Location-aware planning
- People/guest-aware planning
- Requirement-aware planning
- Plan management
- Confirmation tracking
- Notifications
- Support
- Responsive UI
- Secure application behavior

#### Important implementation note

The live GitHub Pages URL supplied as the visual reference could not be fetched by the available web environment at the time this README was generated.

Therefore, this README does **not** claim that every proposed wedding/event/custom-planning capability already exists in the current deployed application.

The repository source should remain the final authority for:

- Existing routes
- Existing components
- Existing API endpoints
- Existing database models
- Existing AI implementation
- Existing authentication
- Existing services
- Existing planning categories
- Existing deployment configuration

---


---

## 50. License

No project license information was supplied.

Add the actual project license here when established.

---

# Service Planner in One Sentence

> **Service Planner is an AI-powered personal planning platform that turns a user's idea, budget, people, location, preferences, and requirements into a personalized plan that can be reviewed, refined, managed, and supported from one place.**

---

# The Long-Term Experience

The intended experience can be summarized as:

```text
                     ┌─────────────────────┐
                     │       USER          │
                     │ "I want to plan..." │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │  SERVICE PLANNER    │
                     │    AI ASSISTANT     │
                     └──────────┬──────────┘
                                │
                  ┌─────────────┼─────────────┐
                  │             │             │
                  ▼             ▼             ▼
               PEOPLE        BUDGET       LOCATION
                  │             │             │
                  └─────────────┼─────────────┘
                                │
                                ▼
                         PREFERENCES
                                │
                                ▼
                         REQUIREMENTS
                                │
                                ▼
                     ┌─────────────────────┐
                     │    AI PLANNING      │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │ PERSONALIZED PLAN   │
                     └──────────┬──────────┘
                                │
                         ┌──────┴──────┐
                         │             │
                         ▼             ▼
                       REVIEW        EDIT
                         │             │
                         └──────┬──────┘
                                │
                                ▼
                       AI REFINEMENT
                                │
                                ▼
                         FINAL PLAN
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
          MANAGEMENT       CONFIRMATIONS     NOTIFICATIONS
              │                 │                 │
              └─────────────────┼─────────────────┘
                                │
                                ▼
                            SUPPORT
```

**Service Planner is not just a planner for one type of service.**

It is designed as a **common AI-powered planning platform** where travel, birthdays, weddings, events, celebrations, and future planning experiences can all use the same simple philosophy:

> **You describe the experience you want. Service Planner helps turn it into a plan you can actually use.**

---

<div align="center">

### Service Planner

**One planning platform. Many experiences. One simple idea:**

> **You describe the experience you want. Service Planner helps turn it into a plan you can actually use.**

</div>

