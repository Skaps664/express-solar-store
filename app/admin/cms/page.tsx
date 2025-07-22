"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Database, FileText, ImageIcon, Globe } from "lucide-react"

export default function CMSPage() {


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Management System</h1>
        <p className="text-muted-foreground">Manage your website content through Sanity CMS and other content tools.</p>
      </div>

      {/* Sanity Studio Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Sanity Studio</CardTitle>
          <CardDescription>Access your Sanity CMS directly from the admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Sanity Studio Dashboard</h3>
                  <p className="text-sm text-muted-foreground">Manage all your content types, schemas, and data</p>
                </div>
              </div>
              <Button asChild>
                <a href="https://express-cms.vercel.app/" target="_blank" rel="noopener noreferrer">
                  Open Sanity Studio
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://express-cms.vercel.app/structure/homePageContent;d70b1c61-6194-4670-bfbc-894891aece82" target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-3 w-3" />
                    Home Heading Content
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://express-cms.vercel.app/structure/homePageAds;ab91d5cf-0b39-4594-8f53-b74239cc5b94" target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-3 w-3" />
                    Home Ads
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://express-cms.vercel.app//structure/homePageBanner;09a86969-235c-4a72-8ad8-cd0eeb2ba35f" target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-3 w-3" />
                    Home Banner
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://express-cms.vercel.app/structure/solarExpressBannerOne;25d7741d-26b0-4b07-b2c3-f8d8f2e57a71" target="_blank" rel="noopener noreferrer">
                    <ImageIcon className="mr-2 h-3 w-3" />
                    Home Info Banner
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      
    </div>
  )
}
