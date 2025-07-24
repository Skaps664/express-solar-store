"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { client, urlForImage } from "@/lib/sanity";

interface MiniTopAdData {
  headline: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: any;
}

export default function MiniTopSolarAd() {
  const [adData, setAdData] = useState<MiniTopAdData>({
    headline: "Ready to Go Solar?",
    description: "Schedule a free consultation with our solar experts today",
    buttonText: "Book Consultation",
    buttonLink: "#"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "solarAds"][0] {
            miniTopAd {
              headline,
              description,
              buttonText,
              buttonLink,
              backgroundImage
            }
          }
        `);
        
        if (data?.miniTopAd) {
          setAdData(data.miniTopAd);
        }
      } catch (error) {
        console.error("Error fetching mini top ad data:", error);
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = () => {
    if (adData.buttonLink) {
      window.open(adData.buttonLink, '_blank');
    }
  };

  const backgroundStyle = adData.backgroundImage 
    ? {
        backgroundImage: `linear-gradient(rgba(26, 92, 164, 0.8), rgba(26, 92, 164, 0.8)), url(${urlForImage(adData.backgroundImage).url()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {
        backgroundColor: '#1a5ca4'
      };

  return (
    <div 
      className="rounded-lg p-6 md:p-8 my-8 text-white relative overflow-hidden"
      style={backgroundStyle}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {adData.headline}
          </h2>
          <p className="mb-4 md:mb-0">
            {adData.description}
          </p>
        </div>
        <div className="flex md:justify-end">
          <Button 
            className="bg-white text-[#1a5ca4] hover:bg-gray-100 w-fit"
            onClick={handleButtonClick}
          >
            {adData.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
