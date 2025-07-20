"use client";

import { Button } from "@/components/ui/button";

export default function MiniBottomSolarAd() {
  return (
    <div className="bg-[#1a5ca4] rounded-lg p-6 md:p-8 my-8 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Ready to Go Solar?
          </h2>
          <p className="mb-4 md:mb-0">
            Schedule a free consultation with our solar experts today
          </p>
        </div>
        <Button className="bg-white text-[#1a5ca4] hover:bg-gray-100">
          Book Consultation
        </Button>
      </div>
    </div>
  );
}
