import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginForm />
      </motion.div>
    </div>
  );
}
