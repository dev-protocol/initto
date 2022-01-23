---
title: "Building a Scalable Design System for The Dev Protocol Ecosystem"
author: Matteu
date: 2022-01-23
socialImage: 'https://raw.githubusercontent.com/dev-protocol/hashi-web/main/media/img.png'
level: BEGINNER
tags:
- Hashi
- Design System
- Design
- UI/UX
---

![cover](https://raw.githubusercontent.com/dev-protocol/hashi-web/main/media/img.png)

Throughout the Dev Protocol application ecosystem, we tend to solve specific problems through those applications. In turn, we develop user interfaces according to how we're going to address those problems we're trying to solve in the application. As the ecosystem expands and improves, we're starting to notice a few consistency issues, especially when it comes to design. We knew we're going to need something that will help us tie these applications together to ***scream*** as one entity. As any growing organization would do, we decided to create a design system.

## スタート！ (Start!)
From the beginning, we always had three main aims when creating Hashi: It has to be **consistent**, it has to be **beautiful**, and it has to be **agnostic of any frontend framework**. Let's tackle these aims one by one.

### Consistency
The design system should make an application feel in line with the other applications, and ultimately to the Dev Protocol brand.

### Beauty
The design system should look pleasing to the user's eyes. All elements we place on the screen should be in harmony with each other.

### Framework Agnostic
It should work regardless of any frontend framework that is used in the project. We took to consideration that the projects are made in different technologies; Some are made with regular HTML/CSS, and Javascript, others are made in React, some are made in Vue, etc. We should be able to make the implementation work with any of these technologies.

## How do we solve this?
### Auditing
Using design tokens was a pretty obvious choice for us. Because of its ability to provide the smallest unit of consistency, yet it also provides a powerful cohesive bond for the user experience.

Initially, we received a figma file from one of the [stakes.social](https://stakes.social) designers -- As they were planning to do a redesign of the platform. The figma file contained the updated design, and a few branding guidelines. We figured it's a good place to initialize the project, so we decided to take the time to audit all the design tokens and the reusable components.

We listed about 10 unique color tokens, 7 shape presets, 8 typography profiles, and about 7 reusable primitive components. With the figma file audit in place, containing all the specs we need to start developing, we head on to making the web implementation.

### Coding
When we were picking a technology to use, we all have different opinions. Some said we should just share a `tailwind.config.js` file for the design system, some said we should just make a React component library and use CSS-in-JS. We could consider these good options, however we ultimately decided to scrap all the abstractions and go "low level". What better technology to use for this problem than the good, old, reliable, stylesheets.

Stylesheets provide us the ability to port the design system to any framework. Since there are separate teams working on the different projects, it makes sense for us to just make the implementation using stylesheets. Of course, regular stylesheets could be pretty nasty when maintaining, so we decided to just throw one small abstraction called Sass. Sass makes our stylesheets maintainable by making it more modular. In addition to that, we use mixins and functions extensively to create a powerful component style creation API.

Now, let's talk about architecture. We were not sure on how to tackle this issue, so we took a day off of planning and just did some research. We scouted the internet for articles and tech talk videos in relation to making design systems scalable, we ultimately decided to implement three main concepts: Token-Driven Approach (Spotify), Primitive Components (Spotify), and the Base-Variance Pattern (Air-Bnb).

Token-driven approach is, well, a design system architecture that depends and runs on design tokens. And since this is one of the approaches we decided to take, all styles depend on a core module that handles tokens and keys. We pulled in [sentro](https://github.com/MatteuSan/sentro) to create and manage the tokens. As we create new components for the library, everything depends on the sentro wrapper we placed inside the core module.

Now we get to one of the more controversial technical choices: Primitive Components. Meaning we will only provide the basic, small to medium components like buttons, text fields, select fields, etc. We decided to use this because of the sheer size of different design problems each project has to solve. We could just make a single universal header component, but that would be hard to maintain as it would not please each design problem. We ended up listing only 7 components that are vital to solving both consistency, and flexibility for each project to solve its own design problems.

Lastly, we applied the base-variance pattern for the primitive components. This allows us to create variations of a component without having to worry about code duplication. The approach takes advantage of style inheritance, and a very unusual (underrated I must say) way of using CSS variables. CSS variables have their very own weird yet satisfyingly good quirks to it in comparison to regular variables: It can override current properties, and set fallback values -- I must say, the CSS working group did a very good job in implementing these. With this knowledge in mind, we can use sentro's built in key creation feature for creating our component's [theming](https://hashi-docs.netlify.app/docs/core/api/render) and [extend](https://hashi-docs.netlify.app/docs/core/api/extend) API.

### Maintenance
With the current architecture of the codebase, the pain of maintenance is surely reduced by a large margin. Compared to if we were to use a different approach than this. Of course, improvements and changes are to be expected as time passes, just like how codebase goes through.

## So... what now?
The design system journey isn't over yet. As of writing this, we've just released the [first stable version](https://github.com/dev-protocol/hashi-web/releases/tag/0.1.0) of the web implementation, and only one project has started implementing the design system. As the library grows in maturity, we expect feature requests, and bug fixes these applications are going to find while coding. But ultimately, we expect the other applications to adopt the design system in their next major refactor.

If you wish to browse the documentation of the design system, click [this link](https://hashi-docs.netlify.app). If you feel like just browsing the codebase, it can be found [here](https://github.com/dev-protocol/hashi-web) (by the way, contributions are always welcome ;>).

Thanks for taking the time to read this article. Hope you've gained some insight on what goes to develop something a lot of our applications depend on.