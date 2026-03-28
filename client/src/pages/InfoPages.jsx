import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const InfoPage = ({ title, subtitle, children }) => (
  <div className="container mx-auto px-4 py-20 animate-fade-in">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-primary tracking-tighter mb-4">{title}</h1>
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">{subtitle}</p>
        <div className="w-20 h-1.5 bg-primary mx-auto mt-8 rounded-full" />
      </div>
      <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-20 border border-gray-50 prose prose-lg max-w-none prose-headings:text-dark prose-headings:font-black prose-p:text-gray-500 prose-p:font-medium prose-p:leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

export const About = () => (
  <InfoPage title="Our Story" subtitle="Baking Dreams Since 2010">
    <h2>A Legacy of Sweetness</h2>
    <p>Dough-Re-Mi started as a small family kitchen with a big dream: to bring the finest, freshest, and most creative cakes to every celebration in Pakistan. What began with a single oven and a handful of recipes has grown into a nationwide destination for dessert lovers.</p>
    <p>Our philosophy is simple: we never compromise on quality. Every cake is baked from scratch using premium ingredients, from Belgian chocolate to fresh local fruits. Our team of expert bakers and artists work tirelessly to ensure that every treat that leaves our kitchen is a masterpiece.</p>
    <h3>Why Choose Dough-Re-Mi?</h3>
    <ul>
      <li><strong>Handcrafted with Love:</strong> No mass production here. Every order is personalized.</li>
      <li><strong>Freshness Guaranteed:</strong> We bake your cake only after you place your order.</li>
      <li><strong>Eggless Specialists:</strong> We offer a wide range of 100% eggless delights without sacrificing taste.</li>
    </ul>
  </InfoPage>
);

export const Contact = () => (
  <InfoPage title="Contact Us" subtitle="We'd Love to Hear from You">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 not-prose mb-16">
      <div className="text-center">
        <div className="w-16 h-16 bg-light rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
          <Mail className="w-8 h-8" />
        </div>
        <h4 className="font-black text-dark mb-2">Email Us</h4>
        <p className="text-gray-400 text-sm font-bold">hello@doughremi.com</p>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 bg-light rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
          <Phone className="w-8 h-8" />
        </div>
        <h4 className="font-black text-dark mb-2">Call Us</h4>
        <p className="text-gray-400 text-sm font-bold">+92 300 1234567</p>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 bg-light rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
          <MapPin className="w-8 h-8" />
        </div>
        <h4 className="font-black text-dark mb-2">Visit Us</h4>
        <p className="text-gray-400 text-sm font-bold">Main Boulevard, Gulberg, Lahore</p>
      </div>
    </div>
    <form className="space-y-6 not-prose">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="text" placeholder="Your Name" className="w-full bg-light border-transparent rounded-2xl px-6 py-4 font-bold text-dark focus:ring-2 focus:ring-primary/20 transition-all" />
        <input type="email" placeholder="Your Email" className="w-full bg-light border-transparent rounded-2xl px-6 py-4 font-bold text-dark focus:ring-2 focus:ring-primary/20 transition-all" />
      </div>
      <input type="text" placeholder="Subject" className="w-full bg-light border-transparent rounded-2xl px-6 py-4 font-bold text-dark focus:ring-2 focus:ring-primary/20 transition-all" />
      <textarea rows="5" placeholder="How can we help?" className="w-full bg-light border-transparent rounded-2xl px-6 py-4 font-bold text-dark focus:ring-2 focus:ring-primary/20 transition-all resize-none"></textarea>
      <button className="bg-primary text-white font-black px-10 py-5 rounded-2xl hover:bg-[#2D0A0A] transition-all uppercase tracking-widest text-xs shadow-xl shadow-primary/20 w-full md:w-auto">
        Send Message
      </button>
    </form>
  </InfoPage>
);

export const PolicyPage = ({ title, lastUpdated, content }) => (
  <InfoPage title={title} subtitle={`Last Updated: ${lastUpdated}`}>
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </InfoPage>
);

export const Blogs = () => (
  <InfoPage title="Bakery Blogs" subtitle="Sweet Stories & Recipes">
    <div className="space-y-12">
      <div className="border-b border-gray-100 pb-8">
        <h3 className="text-2xl font-black text-dark mb-4">The Secret to the Perfect Eggless Sponge</h3>
        <p>Discover how we achieve that cloud-like texture without using eggs. It's all in the folding technique...</p>
        <button className="text-primary font-black uppercase text-xs tracking-widest mt-4">Read More →</button>
      </div>
      <div className="border-b border-gray-100 pb-8">
        <h3 className="text-2xl font-black text-dark mb-4">5 Trending Cake Designs for 2024</h3>
        <p>From minimalist textures to vibrant botanical presses, here's what's hot in the world of cake artistry...</p>
        <button className="text-primary font-black uppercase text-xs tracking-widest mt-4">Read More →</button>
      </div>
    </div>
  </InfoPage>
);

export const Locations = () => (
  <InfoPage title="Locate Us" subtitle="Find a Dough-Re-Mi Near You">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 not-prose">
      <div className="bg-light p-8 rounded-[2rem]">
        <h4 className="font-black text-primary uppercase tracking-widest mb-4">Lahore Flagship</h4>
        <p className="text-gray-500 font-bold mb-2">Main Boulevard, Gulberg III</p>
        <p className="text-gray-400 text-sm">Open: 10:00 AM - 11:00 PM</p>
      </div>
      <div className="bg-light p-8 rounded-[2rem]">
        <h4 className="font-black text-primary uppercase tracking-widest mb-4">Karachi Studio</h4>
        <p className="text-gray-500 font-bold mb-2">Khayaban-e-Shahbaz, DHA Phase 6</p>
        <p className="text-gray-400 text-sm">Open: 11:00 AM - 12:00 AM</p>
      </div>
      <div className="bg-light p-8 rounded-[2rem]">
        <h4 className="font-black text-primary uppercase tracking-widest mb-4">Islamabad Corner</h4>
        <p className="text-gray-500 font-bold mb-2">F-7 Markaz, Next to Flower Market</p>
        <p className="text-gray-400 text-sm">Open: 10:00 AM - 10:00 PM</p>
      </div>
    </div>
  </InfoPage>
);

export const OrderInfo = () => (
  <InfoPage title="Order Info" subtitle="Everything you need to know about your order">
    <h3>Ordering Process</h3>
    <p>Orders can be placed directly through our website. Once an order is placed, you will receive a confirmation email. Our team will then start preparing your fresh treats!</p>
    <h3>Delivery Times</h3>
    <p>Standard delivery takes 2-4 hours. For customized theme cakes, please order at least 24-48 hours in advance.</p>
    <h3>Payment Methods</h3>
    <p>We accept all major credit/debit cards and popular local digital wallets.</p>
  </InfoPage>
);

