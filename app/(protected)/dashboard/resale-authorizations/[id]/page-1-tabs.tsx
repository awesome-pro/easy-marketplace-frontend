// This file contains the additional tabs content for the ResaleAuthorizationDetailPage

import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO } from 'date-fns';
import { FileText, Tag, DollarSign, Calendar, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Format date function
const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'PPP');
  } catch (e) {
    return 'N/A';
  }
};

// Dimensions Tab
export function DimensionsTab({ authorization }: { authorization: any }) {
  const dimensions = authorization.Dimensions || [];
  
  return (
    <TabsContent value="dimensions" className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Product Dimensions
          </CardTitle>
          <CardDescription>
            Product dimensions and units available in this authorization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dimensions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Types</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dimensions.map((dimension: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{dimension.Name}</TableCell>
                    <TableCell>{dimension.Description || 'N/A'}</TableCell>
                    <TableCell className="font-mono">{dimension.Key}</TableCell>
                    <TableCell>{dimension.Unit}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {dimension.Types?.map((type: string, idx: number) => (
                          <Badge key={idx} variant="outline">{type}</Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground py-4 text-center">No dimensions found for this authorization</p>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

// Terms Tab
export function TermsTab({ authorization }: { authorization: any }) {
  const terms = authorization.Terms || [];
  
  return (
    <TabsContent value="terms" className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Authorization Terms
          </CardTitle>
          <CardDescription>
            Terms and conditions associated with this resale authorization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {terms.length > 0 ? (
            <div className="space-y-6">
              {terms.map((term: any, index: number) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{term.Type}</h3>
                      <p className="text-sm text-muted-foreground font-mono">ID: {term.Id}</p>
                    </div>
                    {term.CurrencyCode && (
                      <Badge variant="outline" className="ml-2">{term.CurrencyCode}</Badge>
                    )}
                  </div>
                  
                  {/* Pricing Terms */}
                  {term.Type === 'ResaleConfigurableUpfrontPricingTerm' && term.RateCards && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Rate Cards</h4>
                      <ScrollArea className="h-[200px]">
                        {term.RateCards.map((rateCard: any, rcIndex: number) => (
                          <div key={rcIndex} className="mb-4 border-b pb-4 last:border-b-0">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">
                                {rateCard.Selector.Type}: {rateCard.Selector.Value}
                              </p>
                            </div>
                            
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Dimension</TableHead>
                                  <TableHead>Price</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {rateCard.RateCard.map((rate: any, rateIndex: number) => (
                                  <TableRow key={rateIndex}>
                                    <TableCell>{rate.DimensionKey}</TableCell>
                                    <TableCell>${rate.Price}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            
                            {rateCard.Constraints && (
                              <div className="mt-2 text-sm text-muted-foreground">
                                <p>Multiple Dimension Selection: {rateCard.Constraints.MultipleDimensionSelection}</p>
                                <p>Quantity Configuration: {rateCard.Constraints.QuantityConfiguration}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                  
                  {/* Legal Terms */}
                  {term.Type === 'BuyerLegalTerm' && term.Documents && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Legal Documents</h4>
                      <div className="space-y-2">
                        {term.Documents.map((doc: any, docIndex: number) => (
                          <div key={docIndex} className="flex items-center justify-between">
                            <span>{doc.Type}</span>
                            <Button variant="outline" size="sm" asChild>
                              <a href={doc.Url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View Document
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Buyer Targeting Terms */}
                  {term.Type === 'BuyerTargetingTerm' && term.PositiveTargeting && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Targeted Buyers</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Legal Name</TableHead>
                            <TableHead>AWS Account ID</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {term.PositiveTargeting.BuyerAccounts?.map((buyer: any, buyerIndex: number) => (
                            <TableRow key={buyerIndex}>
                              <TableCell>{buyer.LegalName}</TableCell>
                              <TableCell className="font-mono">{buyer.AwsAccountId}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4 text-center">No terms found for this authorization</p>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

// Rules Tab
export function RulesTab({ authorization }: { authorization: any }) {
  const rules = authorization.Rules || [];
  
  return (
    <TabsContent value="rules" className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Authorization Rules
          </CardTitle>
          <CardDescription>
            Rules governing this resale authorization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rules.length > 0 ? (
            <div className="space-y-6">
              {rules.map((rule: any, index: number) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{rule.Type}</h3>
                      <p className="text-sm text-muted-foreground font-mono">ID: {rule.Id}</p>
                    </div>
                  </div>
                  
                  {/* Availability Rule */}
                  {rule.Type === 'AvailabilityRule' && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">End Date</p>
                          <p className="font-medium">{formatDate(rule.AvailabilityEndDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Usage: {rule.Usage}</Badge>
                        {rule.OffersMaxQuantity && (
                          <Badge variant="outline">Max Offers: {rule.OffersMaxQuantity}</Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Partner Targeting Rule */}
                  {rule.Type === 'PartnerTargetingRule' && (
                    <div className="mt-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Reseller</p>
                          <p className="font-medium">{rule.ResellerLegalName}</p>
                          <p className="text-xs font-mono">AWS ID: {rule.ResellerAccountId}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4 text-center">No rules found for this authorization</p>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

// Details Tab
export function DetailsTab({ authorization }: { authorization: any }) {
  return (
    <TabsContent value="details" className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Raw Authorization Data
          </CardTitle>
          <CardDescription>
            Complete technical details of this authorization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <pre className="text-xs font-mono">
              {JSON.stringify(authorization, null, 2)}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
