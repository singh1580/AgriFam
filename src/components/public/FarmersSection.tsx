
import React from 'react';
import FarmerBenefits from './FarmerBenefits';
import FarmerStats from './FarmerStats';
import FarmerProducts from './FarmerProducts';
import FarmerCTA from './FarmerCTA';

const FarmersSection = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Empower Your Farm Business</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of farmers who are maximizing their profits by selling directly to bulk buyers. 
            Get better prices, faster payments, and grow your agricultural business.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <FarmerBenefits />
        </div>

        {/* Demo Dashboard */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Your Farmer Dashboard Preview</h3>
            <p className="text-gray-600">See how easy it is to manage your products and track your earnings</p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8">
            <FarmerStats />
          </div>

          {/* Products Demo */}
          <FarmerProducts />
        </div>

        {/* Call to Action */}
        <FarmerCTA />
      </div>
    </div>
  );
};

export default FarmersSection;
