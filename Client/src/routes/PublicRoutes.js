// // src/routes/PublicRoutes.js
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';

// // Public pages
// import HomePage from '../pages/HomePage';
// import AboutUsPage from '../pages/AboutUsPage';
// import ContactUsPage from '../pages/ContactusPage';

// const PublicRoutes = () => {
//     return (
//         <Routes>
//             <Route index element={<HomePage />} />
//             <Route path="about" element={<AboutUsPage />} />
//             <Route path="contact" element={<ContactUsPage />} />

//             {/* Redirect any other paths to home */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//     );
// };

// export default PublicRoutes;