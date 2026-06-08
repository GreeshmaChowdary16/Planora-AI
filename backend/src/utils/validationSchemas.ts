import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Full name is required',
    }).min(2, 'Name must be at least 2 characters long'),
    email: z.string({
      required_error: 'Email address is required',
    }).email('Invalid email address format'),
    password: z.string({
      required_error: 'Password is required',
    }).min(6, 'Password must be at least 6 characters long'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email address is required',
    }).email('Invalid email address format'),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

export const analyzeProjectSchema = z.object({
  body: z.object({
    projectName: z.string({
      required_error: 'Project name is required',
    }).min(3, 'Project name must be at least 3 characters long'),
    description: z.string({
      required_error: 'Project description is required',
    }).min(10, 'Description must be at least 10 characters long'),
    domain: z.string({
      required_error: 'Domain is required',
    }),
    skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
      required_error: 'Skill level must be Beginner, Intermediate, or Advanced',
    }),
    timeline: z.string().optional().default('6 weeks'),
  }),
});
