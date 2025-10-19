import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, Target, Rocket, Award, Calendar, Globe, TrendingUp, Menu, X } from 'lucide-react';
import Footer from "../../components/Footer/Footer";
import { Link } from 'react-router-dom';
import LandingNavbar from '../../components/LandingNavbar/LandingNavbar';


const LandingPage = () => {

  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const elements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setIsVisible((prev) => ({ ...prev, [id]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);




  return (
    <div className="min-h-screen bg-white">

      <LandingNavbar/>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex flex-col justify-center items-center pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10" >
          <div id="hero-title"
            data-animate
            className={`transition-all duration-1000 transform ${isVisible['hero-title'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}>
            <h2 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 ">
              Startup <span className="text-blue-600">Studio</span>
            </h2>
          </div>
          <div id="sub-title"
            data-animate
            className={`transition-all duration-1400 transform ${isVisible['hero-title'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}>
            <p className="text-3xl md:text-4xl text-gray-700 mb-6 font-light ">
              Turn Your Idea Into Reality
            </p>
          </div>
          <div id="sub-title"
            data-animate
            className={`transition-all duration-1700 transform ${isVisible['hero-title'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed ">
              Every great startup begins with conviction - but conviction grows faster with the right mentorship.
              If you've ever had that one idea you couldn't stop thinking about - this is where you make it real.
            </p>
          </div>
          <div
            id="sub-title"
            data-animate
            className={`transition-all duration-2000 transform ${isVisible['hero-title'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
          >
            <Link to="/cohort-registration" className="max-w-sm group border-2 border-blue-600 cursor-pointer text-blue-600 px-10 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all hover:text-white duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform mx-auto">
              Join Cohort
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </div>

        </div>
      </section>

      {/* What We Do Section */}
      <section className="min-h-screen py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-gray-900 mb-6">What We Do</h3>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A 90-day, high-touch mentorship program bridging the gap between "I have an idea" and "I built something that works"
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users size={28} />,
                title: "Personalized Mentorship",
                desc: "Work 1:1 with seasoned founders and domain specialists",
                color: "blue"
              },
              {
                icon: <Rocket size={28} />,
                title: "MVP Building & Validation",
                desc: "Turn your concept into a tangible product",
                color: "indigo"
              },
              {
                icon: <Target size={28} />,
                title: "Go-To-Market Guidance",
                desc: "Understand your customers and build your first traction",
                color: "purple"
              },
              {
                icon: <Award size={28} />,
                title: "Investor Connections",
                desc: "Pitch at our Demo Day - 'Fetching Fortunes' - to VCs and angels",
                color: "pink"
              },
              {
                icon: <Users size={28} />,
                title: "Co-Founder Matching",
                desc: "Find your perfect teammate from the IIT Hyderabad community",
                color: "red"
              },
              {
                icon: <TrendingUp size={28} />,
                title: "Post-Cohort Support",
                desc: "Stay connected with mentors and alumni even after graduation",
                color: "orange"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 hover:-translate-y-2 transform cursor-pointer"
              >
                <div className={`bg-gradient-to-br from-blue-500 to-blue-600 text-white w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Get - Visual Cards */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-gray-900 mb-6">What You'll Get</h3>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 transform">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xl">
                  1
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Expert Mentorship</h4>
                  <p className="text-gray-600">Industry veterans guiding your every step</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 transform">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xl">
                  2
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Build Your MVP</h4>
                  <p className="text-gray-600">From concept to working product in 90 days</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 transform">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xl">
                  3
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Network & Connections</h4>
                  <p className="text-gray-600">Access to investors, partners, and co-founders</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 transform">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xl">
                  4
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Demo Day Pitch</h4>
                  <p className="text-gray-600">Present at "Fetching Fortunes" to VCs and angels</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cohort Details */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-gray-900 mb-6">Cohort Details</h3>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-16">
            {[
              { icon: <Calendar />, label: "Duration", value: "90 Days", desc: "Intensive program" },
              { icon: <Globe />, label: "Mode", value: "100% Online", desc: "Learn from anywhere" },
              { icon: <Users />, label: "Cohort Size", value: "10-12 Startups", desc: "Exclusive community" }
            ].map((item, index) => (
              <div key={index} className="group text-center bg-gradient-to-br from-blue-50 to-white p-10 rounded-2xl hover:shadow-xl transition-all duration-500 hover:-translate-y-2 transform border border-blue-100">
                <div className="bg-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                  {React.cloneElement(item.icon, { size: 36 })}
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-2">{item.value}</h4>
                <p className="text-blue-600 font-semibold mb-2">{item.label}</p>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-white shadow-2xl">
            <h4 className="text-3xl font-bold mb-8">Who Can Apply?</h4>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-500">
                <div className="text-4xl mb-4">💡</div>
                <p className="text-lg font-medium">Founders at post-ideation or validation stage</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-500">
                <div className="text-4xl mb-4">🎓</div>
                <p className="text-lg font-medium">Student entrepreneurs from IIT Hyderabad</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-500">
                <div className="text-4xl mb-4">🚀</div>
                <p className="text-lg font-medium">Early-stage founders from outside the campus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Startup Studio - Quote Section */}
      <section className="py-15 px-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h3 className="text-5xl font-bold mb-8">Why Startup Studio?</h3>
          <p className="text-2xl mb-10 font-light">
            Because building alone is tough - but building with guidance is transformative.
          </p>
          <div className="bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-500">
            <div className="text-6xl mb-1 opacity-50">"</div>
            <blockquote className="text-3xl font-light italic mb-8 leading-relaxed">
              The right mentorship doesn't just improve your startup. It changes how you think about building one.
            </blockquote>
            <div className="text-6xl opacity-50 transform rotate-180">"</div>
          </div>
          <p className="text-xl mt-10 max-w-3xl mx-auto leading-relaxed">
            Our mentors come from diverse domains - tech, healthcare, design, business, law, and more - ensuring that no matter your challenge, someone's already solved it before and can guide you through it.
          </p>
        </div>
      </section>

      {/* E-Cell IIT Hyderabad */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-5xl font-bold text-gray-900 mb-6">E-Cell IIT Hyderabad</h3>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
            <p className="text-xl text-gray-700 leading-relaxed mb-8 text-center">
              Startup Studio is powered by the <span className="font-bold text-blue-600">Entrepreneurship Cell, IIT Hyderabad</span>, a student-led initiative dedicated to fostering innovation and entrepreneurial excellence on campus and beyond.
            </p>
            <div className="bg-blue-50 rounded-2xl p-8 text-center">
              <p className="text-2xl font-semibold text-gray-900 mb-4">
                Join a community where founders:
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-lg">
                <span className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium">Grow</span>
                <span className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium">Fail Fast</span>
                <span className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium">Learn Faster</span>
                <span className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium">Build Meaningfully</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-5xl font-bold mb-6">Ready to Build Your Startup?</h3>
          <p className="text-2xl mb-10 font-light">
            Applications for the upcoming cohort are now open.
          </p>
          <Link to="/cohort-registration" className="max-w-md group hover:cursor-pointer bg-white text-blue-600 px-12 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 mx-auto shadow-2xl hover:shadow-3xl hover:scale-110 transform">
            Apply Now
            <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;