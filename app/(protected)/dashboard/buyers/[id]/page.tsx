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
import { UserRole, ConnectionStatus } from '@/types/user';
import { useAuthContext } from '@/providers/auth-provider';
import { checkConnectionStatus } from '@/services/connections.api';
import { FileText, ShoppingBag, CreditCard, Clock, Tag } from 'lucide-react';

export default function BuyerDetailPage() {
  const { id } = useParams();
  const { user: currentUser } = useAuthContext();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | undefined>();
  const [connectionId, setConnectionId] = useState<string | undefined>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserById(id as string);
        setUser(userData);

        // Check connection status if current user is an ISV or Reseller
        if (currentUser?.role === UserRole.ISV || currentUser?.role === UserRole.RESELLER) {
          const connectionData = await checkConnectionStatus(id as string);
          setConnectionStatus(connectionData.status);
          setConnectionId(connectionData.connectionId);
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

  // Buyer-specific content
  const BuyerContent = () => (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="about">
          <FileText className="h-4 w-4 mr-2" />
          About
        </TabsTrigger>
        <TabsTrigger value="preferences">
          <Tag className="h-4 w-4 mr-2" />
          Preferences
        </TabsTrigger>
        <TabsTrigger value="purchases">
          <ShoppingBag className="h-4 w-4 mr-2" />
          Purchases
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
              <h3 className="text-lg font-medium">Member Since</h3>
              <p className="text-muted-foreground">
                {format(new Date(user?.createdAt), "MMMM d, yyyy")}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preferences" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Buyer Preferences
            </CardTitle>
            <CardDescription>
              Product and purchasing preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Product Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {user?.buyerProfile?.preferredCategories?.length > 0 ? (
                    user.buyerProfile.preferredCategories.map((category: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {category}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No preferred categories specified</p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Budget Range</h3>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span>{user?.buyerProfile?.budgetRange || 'Not specified'}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Purchase Timeline</h3>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{user?.buyerProfile?.purchaseTimeline || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="purchases" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Purchase History
            </CardTitle>
            <CardDescription>
              Recent product purchases and subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectionStatus === 'ACCEPTED' || connectionStatus === 'AUTHORIZED' ? (
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No purchase history available</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Connect with this buyer to view purchase history</p>
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
        roleSpecificContent={<BuyerContent />}
        connectionStatus={connectionStatus}
        connectionId={connectionId}
      />
    </div>
  );
}
