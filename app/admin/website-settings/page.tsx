"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Globe, Palette, Mail, Shield, Smartphone, Search, AlertTriangle } from "lucide-react"
import WarningBanner from "@/components/warning-banner"

export default function WebsiteSettingsPage() {
  return (
    <div className="space-y-8">
      <WarningBanner/>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Website Settings</h1>
        <p className="text-muted-foreground">Configure your website appearance, functionality, and user experience.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Site Information
              </CardTitle>
              <CardDescription>Basic information about your website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="site-title">Site Title</Label>
                <Input id="site-title" placeholder="Your Solar Store" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="site-tagline">Tagline</Label>
                <Input id="site-tagline" placeholder="Powering your future with clean energy" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea id="site-description" placeholder="Brief description of your website..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" type="email" placeholder="contact@yourstore.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="support-phone">Support Phone</Label>
                  <Input id="support-phone" placeholder="+1 (555) 123-4567" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="business-address">Business Address</Label>
                <Textarea id="business-address" placeholder="Your business address..." />
              </div>
              <Button>Save Site Information</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Site Status & Maintenance</CardTitle>
              <CardDescription>Control site availability and maintenance mode.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Site Online</Label>
                  <p className="text-sm text-muted-foreground">Make your website publicly accessible</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Show maintenance page to visitors</p>
                </div>
                <Switch />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maintenance-message">Maintenance Message</Label>
                <Textarea
                  id="maintenance-message"
                  placeholder="We're currently updating our site. Please check back soon!"
                />
              </div>
              <Button>Update Site Status</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme & Branding
              </CardTitle>
              <CardDescription>Customize your website's visual appearance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="primary-color">Primary Brand Color</Label>
                <div className="flex gap-2">
                  <Input id="primary-color" type="color" defaultValue="#3b82f6" className="w-20" />
                  <Input placeholder="#3b82f6" value="#3b82f6" readOnly />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input id="secondary-color" type="color" defaultValue="#10b981" className="w-20" />
                  <Input placeholder="#10b981" value="#10b981" readOnly />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <div className="flex gap-2">
                  <Input id="accent-color" type="color" defaultValue="#f59e0b" className="w-20" />
                  <Input placeholder="#f59e0b" value="#f59e0b" readOnly />
                </div>
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="site-logo">Site Logo</Label>
                <Input id="site-logo" type="file" accept="image/*" />
                <p className="text-sm text-muted-foreground">Recommended size: 200x60px</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="favicon">Favicon</Label>
                <Input id="favicon" type="file" accept="image/*" />
                <p className="text-sm text-muted-foreground">Recommended size: 32x32px</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode Support</Label>
                  <p className="text-sm text-muted-foreground">Allow users to switch to dark theme</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>Save Appearance Settings</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Layout & Navigation</CardTitle>
              <CardDescription>Configure website layout and navigation structure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="header-style">Header Style</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select header style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="centered">Centered</SelectItem>
                    <SelectItem value="split">Split</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sticky Header</Label>
                  <p className="text-sm text-muted-foreground">Keep header visible when scrolling</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Search in Header</Label>
                  <p className="text-sm text-muted-foreground">Display search bar in main navigation</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Cart in Header</Label>
                  <p className="text-sm text-muted-foreground">Display shopping cart icon</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>Save Layout Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Engine Optimization
              </CardTitle>
              <CardDescription>Optimize your website for search engines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  SEO settings affect how your site appears in search results. Changes may take time to reflect.
                </AlertDescription>
              </Alert>
              <div className="grid gap-2">
                <Label htmlFor="meta-title">Default Meta Title</Label>
                <Input id="meta-title" placeholder="Your Solar Store - Clean Energy Solutions" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meta-description">Default Meta Description</Label>
                <Textarea
                  id="meta-description"
                  placeholder="Discover high-quality solar panels, batteries, and inverters..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meta-keywords">Meta Keywords</Label>
                <Input id="meta-keywords" placeholder="solar panels, batteries, inverters, clean energy" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Generate Sitemap</Label>
                  <p className="text-sm text-muted-foreground">Automatically create XML sitemap</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Robots.txt</Label>
                  <p className="text-sm text-muted-foreground">Control search engine crawling</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="google-analytics">Google Analytics ID</Label>
                <Input id="google-analytics" placeholder="G-XXXXXXXXXX" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="google-search-console">Google Search Console</Label>
                <Input id="google-search-console" placeholder="Verification code" />
              </div>
              <Button>Save SEO Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Features</CardTitle>
              <CardDescription>Enable or disable website functionality.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new users to create accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Product Reviews</Label>
                  <p className="text-sm text-muted-foreground">Enable customer product reviews</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Wishlist Feature</Label>
                  <p className="text-sm text-muted-foreground">Allow users to save favorite products</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Product Comparison</Label>
                  <p className="text-sm text-muted-foreground">Enable side-by-side product comparison</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Live Chat Support</Label>
                  <p className="text-sm text-muted-foreground">Enable customer support chat</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Newsletter Signup</Label>
                  <p className="text-sm text-muted-foreground">Show newsletter subscription forms</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Social Media Sharing</Label>
                  <p className="text-sm text-muted-foreground">Add social share buttons to products</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>Save Feature Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>Configure external service integrations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">Email Service</h3>
                      <p className="text-sm text-muted-foreground">Configure email delivery service</p>
                    </div>
                  </div>
                  <Badge variant="outline">Not Connected</Badge>
                </div>
                <div className="grid gap-2 pl-11">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" placeholder="smtp.gmail.com" />
                </div>
                <div className="grid grid-cols-2 gap-4 pl-11">
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" placeholder="587" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-encryption">Encryption</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select encryption" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-8 w-8 text-green-500" />
                    <div>
                      <h3 className="font-semibold">SMS Notifications</h3>
                      <p className="text-sm text-muted-foreground">Send SMS updates to customers</p>
                    </div>
                  </div>
                  <Badge>Connected</Badge>
                </div>
                <div className="grid gap-2 pl-11">
                  <Label htmlFor="sms-api-key">SMS API Key</Label>
                  <Input id="sms-api-key" type="password" placeholder="••••••••••••••••" />
                </div>
              </div>
              <Separator />
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-8 w-8 text-purple-500" />
                    <div>
                      <h3 className="font-semibold">Security Service</h3>
                      <p className="text-sm text-muted-foreground">DDoS protection and security monitoring</p>
                    </div>
                  </div>
                  <Badge>Connected</Badge>
                </div>
              </div>
              <Button>Save Integration Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Technical configurations for advanced users.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Advanced settings can affect site performance and functionality. Proceed with caution.
                </AlertDescription>
              </Alert>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Caching</Label>
                  <p className="text-sm text-muted-foreground">Improve site performance with caching</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cache-duration">Cache Duration (minutes)</Label>
                <Input id="cache-duration" type="number" placeholder="60" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable CDN</Label>
                  <p className="text-sm text-muted-foreground">Use Content Delivery Network for assets</p>
                </div>
                <Switch />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cdn-url">CDN URL</Label>
                <Input id="cdn-url" placeholder="https://cdn.example.com" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">Show detailed error messages</p>
                </div>
                <Switch />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="custom-css">Custom CSS</Label>
                <Textarea id="custom-css" placeholder="/* Add your custom CSS here */" className="font-mono" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="custom-js">Custom JavaScript</Label>
                <Textarea id="custom-js" placeholder="// Add your custom JavaScript here" className="font-mono" />
              </div>
              <Button>Save Advanced Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
