// src/pages/HomePage.js

// Layout Components
import MainHeader from '../components/layout/MainHeader';
import Footer from '../components/layout/Footer';

// Homepage Section Components
import HeroSection from '../components/homepage/HeroSection';
import BenefitsSection from '../components/homepage/BenefitsSection';
import StatisticsSection from '../components/homepage/StatisticsSection';
import NewsSection from '../components/homepage/NewsSection';
import TestimonialsSection from '../components/homepage/TestimonialsSection';
import CTASection from '../components/homepage/CTASection';

// Common Components

const HomePage = () => {
    // const [loginVisible, setLoginVisible] = useState(false);

    return (
        <div className="font-sans bg-gray-50 min-h-screen" dir="rtl">

            {/* Header */}
            <MainHeader />

            {/* Hero Section */}
            <HeroSection />

            {/* Benefits Section */}
            <BenefitsSection />

            {/* Statistics Section */}
            <StatisticsSection />

            {/* News Section */}
            <NewsSection />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* CTA Section */}
            <CTASection />

            {/* Footer */}
            <Footer />


        </div>
    );
};

export default HomePage;