
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, Star, Globe } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Wheat Farmer, Punjab",
      content: "With AgriLink, my wheat prices increased by 40%. Getting direct buyers and instant payments is the best feature.",
      rating: 5,
      image: "photo-1472396961693-142e6e269027",
      location: "Punjab, India"
    },
    {
      name: "Priya Sharma",
      role: "Bulk Food Processor",
      content: "Quality produce is available and pricing is transparent. Our business has grown 3x with this platform.",
      rating: 5,
      image: "photo-1466721591366-2d5fba72006d",
      location: "Delhi, India"
    },
    {
      name: "Amit Patel",
      role: "Organic Farmer, Gujarat",
      content: "The platform interface is simple and payments come instantly. The quality grading system is very accurate.",
      rating: 5,
      image: "photo-1493962853295-0fd70327578a",
      location: "Gujarat, India"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Success Stories from Farmers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from real users who have transformed their agricultural business.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="animate-fade-in hover-scale bg-gradient-to-br from-white via-white to-gray-50/30 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2" 
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-full bg-cover bg-center shadow-lg ring-4 ring-white"
                      style={{
                        backgroundImage: `url(https://images.unsplash.com/${testimonial.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80)`
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <Globe className="h-3 w-3 mr-1" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-harvest-yellow fill-current" />
                    ))}
                  </div>
                  
                  <div className="relative">
                    <Quote className="h-8 w-8 text-crop-green/30 mb-2" />
                    <p className="text-base text-muted-foreground italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
