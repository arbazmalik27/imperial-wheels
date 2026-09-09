import { FaAward, FaCalendarAlt, FaHandsHelping, FaTrophy, FaFacebook, FaTwitter, FaLinkedin, FaShieldAlt } from 'react-icons/fa';
import SectionHeader from '../components/ui/SectionHeader';
import { usePageMeta } from '../hooks/usePageMeta';
import arbaz from "../assets/arbaz.jpg";

const About = () => {
  usePageMeta(
    'About Imperial Wheels',
    'Learn about Imperial Wheels, our team, and our mission to make luxury car rental and sales seamless.'
  );

  const team = [
    {
      name: "Arbaz Malik",
      role: "Founder & CEO",
      avatar: arbaz
    },
    {
      name: "Suhail Khan",
      role: "Chief Operating Officer",
      avatar: "https://images.unsplash.com/photo-1773332585698-cba3c91b73e4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMTN8fHxlbnwwfHx8fHw%3D"
    },
    {
      name: "Anirudh Yadav",
      role: "VP of Quality Control",
      avatar: "https://plus.unsplash.com/premium_photo-1689607809841-cbbc3595f3fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOTF8fHxlbnwwfHx8fHw%3D"
    },
    {
      name: "Vivek Kumar",
      role: "Lead Customer Relations",
      avatar:" https://images.unsplash.com/photo-1657800187829-b1fe14ba4307?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFlc3RldGljJTIwcG9zZSUyMG1lbnxlbnwwfHwwfHx8MA%3D%3D"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader 
          badge="Our Journey"
          title="About Imperial Wheels"
          subtitle="Redefining the standard of premium automotive retail and high-performance travel."
        />

        {/* 1. Company Story */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 text-left flex flex-col gap-6">
            <h3 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 leading-tight">
              Pioneering a Premium Car Buying & Rental Experience
            </h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Founded in 2020, Imperial Wheels started with a single, clear vision: to strip away the friction, lack of trust, and outdated processes of the automotive market, replacing them with a sleek, digital-first luxury experience.
            </p>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              We started by listing local sports rentals in California. Today, we handle a multi-million dollar catalog of pre-owned high-performance supercars and operate across major metropolitan grids, connecting thousands of car enthusiasts daily.
            </p>
            <div className="flex gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <FaAward className="text-blue-600 text-3xl shrink-0 mt-0.5" />
              <div className="text-xs md:text-sm">
                <span className="font-extrabold text-blue-900 block">J.D. Power Customer Trust Award</span>
                <span className="text-blue-700">Ranked #1 premium automotive portal in customer satisfaction.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 h-[380px] md:h-[450px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
            <img 
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80" 
              alt="BMW in showroom" 
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* 2. Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-md">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <FaTrophy className="text-xl" />
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-900 mb-4">Our Mission</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              To build the world's most trusted, fluid, and premium automotive portal, empowering buyers, sellers, and renters to transact without typical dealership stress or hidden fees.
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-md">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
              <FaHandsHelping className="text-xl" />
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-900 mb-4">Our Vision</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              To pioneer the future of automotive ownership by blending car renting subscription systems, validated peer-to-peer used car sales, and secure micro-payment checkouts into a unified SaaS experience.
            </p>
          </div>
        </section>

        {/* 3. Team Members */}
        <section className="mb-24">
          <SectionHeader
            badge="The Brains"
            title="Meet Our Leadership Team"
            subtitle="Meet the engineers, car enthusiasts, and customer relations officers driving the platform forward."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm text-center p-6 hover:shadow-md transition-shadow">
                <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 bg-slate-100 border-2 border-slate-200">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-slate-950 font-display text-lg mb-1">{member.name}</h4>
                <span className="text-xs font-semibold text-blue-600 block mb-4">{member.role}</span>
                <div className="flex justify-center gap-3 text-slate-400">
                  <a href="#" className="hover:text-blue-600 transition-colors"><FaFacebook /></a>
                  <a href="#" className="hover:text-blue-600 transition-colors"><FaTwitter /></a>
                  <a href="#" className="hover:text-blue-600 transition-colors"><FaLinkedin /></a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Why Customers Trust Us */}
        <section className="bg-slate-900 text-white rounded-[40px] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="relative z-10 max-w-4xl">
            <h3 className="text-2xl md:text-4xl font-extrabold font-display leading-tight mb-8">
              Why Car Enthusiasts Trust Imperial Wheels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div>
                <FaShieldAlt className="text-blue-500 text-3xl mb-4" />
                <h4 className="font-bold text-lg mb-2">Double Verification</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Both buyer identities and used car specifications are checked via secure database relays before listing approval.
                </p>
              </div>
              <div>
                <FaCalendarAlt className="text-blue-500 text-3xl mb-4" />
                <h4 className="font-bold text-lg mb-2">48h Cancellation</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Rent vehicles without stress. Cancel bookings up to 48 hours prior to pickup for a complete, hassle-free refund.
                </p>
              </div>
              <div>
                <FaHandsHelping className="text-blue-500 text-3xl mb-4" />
                <h4 className="font-bold text-lg mb-2">Direct Negotiations</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Buy cars directly from their owners. Our secure platform facilitates chat without annoying middleman dealer fees.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
