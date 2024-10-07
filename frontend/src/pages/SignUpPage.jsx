import React from 'react';
import { motion } from 'framer-motion';

function SignUpPage() {
    return (
        <motion.div
            inital={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={'max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-x1 rounded-2x1 shadow-xl overflow-hidden'}
        ></motion.div>
    )
}

export default SignUpPage