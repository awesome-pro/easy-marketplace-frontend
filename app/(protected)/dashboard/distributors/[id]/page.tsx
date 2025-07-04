'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getUserById } from '@/services/users.api';
import { UserDetail } from '@/components/users/user-detail';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FaAws } from 'react-icons/fa';
import { format } from 'date-fns';
import { UserRole } from '@/types/user';
import { FileText, Globe, Building, MapPin, Users } from 'lucide-react';

export default function DistributorDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserById(id as string);
        setUser(userData);
        setIsLoading(false);
      } catch (err: any) {
        setError(err);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  // Distributor-specific content
  const DistributorContent = () => (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="about">
          <FileText className="h-4 w-4 mr-2" />
          About
        </TabsTrigger>
        <TabsTrigger value="network">
          <Globe className="h-4 w-4 mr-2" />
          Network
        </TabsTrigger>
      </TabsList>

      <TabsContent value="about" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>About {user?.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Company</h3>
              <p className="text-muted-foreground">{user?.company}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">AWS Integration</h3>
              <div className="flex items-center mt-2">
                {user?.awsId ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FaAws className="h-3 w-3 text-blue-500" />
                    AWS Marketplace Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Not connected to AWS Marketplace
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">Distribution Reach</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">250+</p>
                      <p className="text-sm text-muted-foreground">Resellers</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Building className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">50+</p>
                      <p className="text-sm text-muted-foreground">ISVs</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">Member Since</h3>
              <p className="text-muted-foreground">
                {format(new Date(user?.createdAt), "MMMM d, yyyy")}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="network" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Distribution Network
            </CardTitle>
            <CardDescription>
              Global reach and market coverage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Geographic Coverage</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'].map((region) => (
                    <div key={region} className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{region}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Industry Focus</h3>
                <div className="flex flex-wrap gap-2">
                  {['Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Government'].map((industry) => (
                    <Badge key={industry} variant="secondary">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Services Offered</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Channel Partner Recruitment</li>
                  <li>Marketing and Sales Support</li>
                  <li>Technical Training</li>
                  <li>Billing and Invoicing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="container py-6 space-y-6">
      <UserDetail 
        user={user} 
        isLoading={isLoading} 
        error={error} 
        roleSpecificContent={<DistributorContent />}
      />
    </div>
  );
}
