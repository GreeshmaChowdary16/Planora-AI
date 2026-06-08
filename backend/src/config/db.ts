import mongoose from 'mongoose';
import dns from 'dns';
import env from '../utils/envValidator';

export const connectDB = async () => {
  try {
    

    await mongoose.connect(env.MONGODB_URI);

    console.log('✅ MongoDB Database Connected Successfully');
  } catch (error: any) {
    const errorMessage = error.message || '';

    // DNS/SRV fallback for MongoDB Atlas
    if (
      errorMessage.includes('querySrv') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('ENOTFOUND')
    ) {
      

      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);

        await mongoose.connect(env.MONGODB_URI);

        console.log('✅ MongoDB Database Connected Successfully');
        return;
      } catch (retryError: any) {
        console.error('❌ DNS Fallback Failed:', retryError.message);
      }
    }

    console.error('❌ Database Connection Failed:', errorMessage);

    process.exit(1);
  }
};