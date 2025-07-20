import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface BrandSettingsStatusProps {
  brand: any;
}

export const BrandSettingsStatus: React.FC<BrandSettingsStatusProps> = ({ brand }) => {
  const settings = brand.pageSettings || {};

  const statusItems = [
    {
      label: 'About Content',
      active: !!settings.aboutContent,
      count: settings.aboutContent?.length || 0
    },
    {
      label: 'Featured Products',
      active: settings.featuredProducts?.length > 0,
      count: settings.featuredProducts?.length || 0
    },
    {
      label: 'Active Promotions',
      active: settings.activePromotions?.length > 0,
      count: settings.activePromotions?.length || 0
    },
    {
      label: 'Why Choose Reasons',
      active: settings.whyChooseReasons?.length > 0,
      count: settings.whyChooseReasons?.length || 0
    },
    {
      label: 'FAQs',
      active: settings.faqs?.length > 0,
      count: settings.faqs?.length || 0
    },
    {
      label: 'Warranty Info',
      active: !!settings.warrantyInformation,
      count: settings.warrantyDocuments?.length || 0
    }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statusItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Badge variant={item.active ? "success" : "secondary"} className="mb-2">
                {item.count}
              </Badge>
              <span className="text-sm font-medium text-gray-700 text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
