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
import { getResaleAuthorizations } from '@/services/resale-authorizations.api';
import { format } from 'date-fns';
import { UserRole, ConnectionStatus } from '@/types/user';
import { useAuthContext } from '@/providers/auth-provider';
import { checkConnectionStatus } from '@/services/connections.api';
import { Store, ShoppingBag, Award, BarChart, FileText, Tag, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ResellerDetailPage() {
  const { id } = useParams();
  const { user: currentUser } = useAuthContext();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [authorizations, setAuthorizations] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | undefined>();
  const [connectionId, setConnectionId] = useState<string | undefined>();
  const [user1Id, setUser1Id] = useState<string | undefined>();
  const [user2Id, setUser2Id] = useState<string | undefined>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserById(id as string);
        setUser(userData);

        // Check connection status if current user is an ISV
        if (currentUser?.role === UserRole.ISV) {
          const connectionData = await checkConnectionStatus(id as string);
          setConnectionStatus(connectionData.status);
          setConnectionId(connectionData.connectionId);
          setUser1Id(connectionData.user1Id);
          setUser2Id(connectionData.user2Id);

          // If connected, fetch resale authorizations
          if (connectionData.connected) {
            const authorizationsData = await getResaleAuthorizations();
            setAuthorizations(authorizationsData || []);
          }
        }

        setIsLoading(false);
      } catch (err: any) {
        setError(err);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id, currentUser]);

  // Reseller-specific content
  const ResellerContent = () => (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="about">
          <FileText className="h-4 w-4 mr-2" />
          About
        </TabsTrigger>
        <TabsTrigger value="specialties">
          <Tag className="h-4 w-4 mr-2" />
          Specialties
        </TabsTrigger>
        <TabsTrigger value="authorizations">
          <Award className="h-4 w-4 mr-2" />
          Authorizations
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
              <h3 className="text-lg font-medium">AWS Role Setup</h3>
              <div className="flex items-center mt-2">
                {user?.resellerProfile?.awsRoleSetup ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    AWS Role Setup Complete
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    AWS Role Setup Pending
                  </Badge>
                )}
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

      <TabsContent value="specialties" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Specialties
            </CardTitle>
            <CardDescription>
              Areas of expertise for {user?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user?.resellerProfile?.specialties && user.resellerProfile.specialties.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.resellerProfile.specialties.map((specialty: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Tag className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No specialties listed</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="authorizations" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Resale Authorizations
            </CardTitle>
            <CardDescription>
              Products authorized for resale
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectionStatus === 'ACCEPTED' || connectionStatus === 'AUTHORIZED' ? (
              authorizations.length > 0 ? (
                <div className="space-y-4">
                  {authorizations.map((auth) => (
                    <Card key={auth.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{auth.product.name}</h3>
                            {/* <p className="text-sm text-muted-foreground">
                              Authorized on {format(new Date(auth.createdDate), "MM dd, yyyy")}
                            </p> */}
                          </div>
                          <Badge variant={auth.status === 'Active' ? 'success' : 'secondary'}>
                            {auth.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className='text-xs'>No resale authorizations available</p>
                  <Link href={`/dashboard/resale-authorizations/create`}>
                    <Button variant="default" size="sm" className="mt-2">
                       Create Resale Authorization
                    </Button>
                  </Link>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Connect with this reseller to manage resale authorizations</p>
                {connectionStatus === 'PENDING' && (
                  <Badge variant="secondary" className="mt-2">Connection request pending</Badge>
                )}
              </div>
            )}
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
        roleSpecificContent={<ResellerContent />}
        connectionStatus={connectionStatus}
        connectionId={connectionId}
        user1Id={user1Id}
        user2Id={user2Id}
      />
    </div>
  );
}
