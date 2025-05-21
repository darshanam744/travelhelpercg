
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { ArrowLeft, BookOpen, Headphones, Globe, Laptop, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-4xl py-8 px-4">
        <Link to="/" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-center">About द्वानी Yatra</h1>
            <p className="text-xl text-center text-muted-foreground mb-8">
              An AI-powered, voice-based public transport query system deeply rooted in Indian Knowledge Systems
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
              <CardDescription>Building inclusive technology for everyone</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                वाणी (Vāṇī) Yatra is designed for users across linguistic and literacy backgrounds, offering an intuitive 
                voice interface to access bus/train timings, route information, and transit guidance. Our system 
                especially empowers those with limited digital or textual literacy, making public transportation 
                information accessible to all.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center space-x-2">
                <Headphones className="h-5 w-5 text-iks-saffron" />
                <div>
                  <CardTitle>Multilingual Support</CardTitle>
                  <CardDescription>Breaking language barriers</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  Our system supports Kannada, Hindi, and English, with plans to expand to other Indian languages. 
                  We understand the importance of serving users in their native tongue.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-x-2">
                <BookOpen className="h-5 w-5 text-iks-green" />
                <div>
                  <CardTitle>Rooted in IKS</CardTitle>
                  <CardDescription>Indian Knowledge Systems</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  We integrate traditional knowledge and cultural context, from landmark-based navigation to 
                  understanding temporal expressions related to cultural events, like "after evening arti."
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-x-2">
                <Globe className="h-5 w-5 text-iks-chakra" />
                <div>
                  <CardTitle>Cultural Context</CardTitle>
                  <CardDescription>Understanding local nuances</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  Our system is festival-aware and understands local landmarks, making navigation intuitive 
                  and natural for users of all backgrounds. We aim to preserve linguistic traditions while 
                  providing modern solutions.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-x-2">
                <Users className="h-5 w-5 text-iks-blue" />
                <div>
                  <CardTitle>Accessible to All</CardTitle>
                  <CardDescription>Inclusive design principles</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  We've designed our application with accessibility in mind, ensuring that people of all abilities 
                  and technical comfort levels can use it with ease. Voice-first interaction removes barriers.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Powered by Dwani AI</CardTitle>
              <CardDescription>Advanced voice recognition technology</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This project utilizes the powerful Dwani AI API to handle multilingual voice input and intent recognition. 
                Dwani's understanding of Indian languages and dialects enables our system to accurately interpret user queries 
                and provide relevant transportation information.
              </p>
              <Button asChild variant="outline">
                <a href="https://dwani.ai" target="_blank" rel="noreferrer" className="inline-flex items-center">
                  <Laptop className="h-4 w-4 mr-2" />
                  Learn more about Dwani AI
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 द्वानी Yatra. All rights reserved.</p>
          <p className="mt-1">An AI-powered public transport query system rooted in Indian Knowledge Systems.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
