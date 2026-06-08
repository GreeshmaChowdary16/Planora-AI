import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  MONGODB_URI: z.string({
    required_error: 'MONGODB_URI is required. Please set up a MongoDB Atlas Cluster and provide its connection URI.',
  }),
  JWT_SECRET: z.string({
    required_error: 'JWT_SECRET is required. Provide a strong cryptographic key to sign user authentication tokens.',
  }).min(10, 'JWT_SECRET must be at least 10 characters long.'),
  GROQ_API_KEY: z.string({
    required_error: 'GROQ_API_KEY is required. Please obtain a key from Groq Console (https://console.groq.com/) to power AI analyses.',
  }),
});

export const validateEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('\n❌ INVALID ENVIRONMENT VARIABLES CONFIGURATION:');
    result.error.errors.forEach((err) => {
      console.error(`   - ${err.path.join('.')}: ${err.message}`);
    });
    console.error('\nPlease check your .env configuration file in the backend folder.\n');
    process.exit(1);
  }

  return result.data;
};

export const env = validateEnv();
export default env;
