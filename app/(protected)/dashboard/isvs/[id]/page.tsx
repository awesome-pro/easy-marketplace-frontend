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
import { Package, ShoppingBag, Award, BarChart, FileText } from 'lucide-react';
import { isvApi } from '@/services';
import Link from 'next/link';

export default function ISVDetailPage() {
  const { id } = useParams();
  const { user: currentUser } = useAuthContext();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
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

        // Fetch products if the user is an ISV
        if (userData.role === UserRole.ISV) {
          const productsData = await isvApi.getProducts(1, 10);
          setProducts(productsData.data.data || []);
        }

        // Check connection status if current user is a reseller
        if (currentUser?.role === UserRole.RESELLER) {
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

  // ISV-specific content
  const ISVContent = () => (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="products">
          <Package className="h-4 w-4 mr-2" />
          Products
        </TabsTrigger>
        <TabsTrigger value="about">
          <FileText className="h-4 w-4 mr-2" />
          About
        </TabsTrigger>
        <TabsTrigger value="authorizations">
          <Award className="h-4 w-4 mr-2" />
          Authorizations
        </TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Products ({products.length})
            </CardTitle>
            <CardDescription>
              Products offered by {user?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                      {product.images && product.images[0] && (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary">
                          {product.price} {product.currency}/{product.billingPeriod.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline">{product.type}</Badge>
                        <Badge variant={product.status === 'ACTIVE' ? 'success' : 'secondary'}>
                          {product.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No products available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

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
              <h3 className="text-lg font-medium">DSOR Status</h3>
              <div className="flex items-center mt-2">
                {user?.isvProfile?.dsorSigned ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    DSOR Signed on {format(new Date(user.isvProfile.dsorSignedDate), "MMMM d, yyyy")}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    DSOR Not Signed
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
                              Authorized on {format(new Date(auth.createdDate), "MMM d, yyyy")}
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
                  <p className='text-muted-foreground text-xs mb-10'>No resale authorizations available</p>
                  <Link href={`/dashboard/resale-authorizations`} className='text-primary hover:underline'>
                    Request Authorizations
                  </Link>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Connect with this ISV to view resale authorizations</p>
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
        roleSpecificContent={<ISVContent />}
        connectionStatus={connectionStatus}
        connectionId={connectionId}
        user1Id={user1Id}
        user2Id={user2Id}
      />
    </div>
  );
}
