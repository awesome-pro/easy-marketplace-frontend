import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TermsTabProps {
  agreement: any; // Using any temporarily, will be properly typed later
}

const TermsTab = ({ agreement }: TermsTabProps) => {
  const { terms } = agreement;

  // Find different term types
  const legalTerm = terms?.find((term: any) => term.legalTerm);
  const validityTerm = terms?.find((term: any) => term.validityTerm);
  const usageBasedPricingTerm = terms?.find((term: any) => term.usageBasedPricingTerm);
  const fixedUpfrontPricingTerm = terms?.find((term: any) => term.fixedUpfrontPricingTerm);
  const paymentScheduleTerm = terms?.find((term: any) => term.paymentScheduleTerm);
  
  // Determine which tab to show by default based on available terms
  const getDefaultTab = (): string => {
    if (paymentScheduleTerm) return "payment-schedule";
    if (fixedUpfrontPricingTerm) return "fixed-upfront";
    if (usageBasedPricingTerm) return "usage-based";
    return "payment-schedule"; // Default to payment schedule tab
  };
  
  // Determine grid class based on number of available pricing terms
  const getTabsGridClass = (): string => {
    const count = [usageBasedPricingTerm, fixedUpfrontPricingTerm, paymentScheduleTerm].filter(Boolean).length;
    if (count === 0) return "grid-cols-1";
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    return "grid-cols-3";
  };
  
  // Format currency values
  const formatCurrency = (value: string, currencyCode: string): string => {
    const numValue = Number(value);
    if (isNaN(numValue)) return value;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(numValue);
  };

  // Format duration string (e.g., "P368D" to "368 days")
  const formatDuration = (durationStr?: string) => {
    if (!durationStr) return "N/A";
    
    // Parse ISO 8601 duration format
    const match = durationStr.match(/P(\d+)([YMWD])/);
    if (!match) return durationStr;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'Y': return `${value} year${value !== 1 ? 's' : ''}`;
      case 'M': return `${value} month${value !== 1 ? 's' : ''}`;
      case 'W': return `${value} week${value !== 1 ? 's' : ''}`;
      case 'D': return `${value} day${value !== 1 ? 's' : ''}`;
      default: return durationStr;
    }
  };

  return (
    <div className="grid gap-6">
      {/* Legal Terms */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Legal Terms</CardTitle>
        </CardHeader>
        <CardContent>
          {legalTerm ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Term ID:</p>
                <p className="font-mono text-xs break-all">{legalTerm.legalTerm.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Documents:</p>
                {legalTerm.legalTerm.documents?.map((doc: any, index: number) => (
                  <div key={index} className="mb-2">
                    <Badge className="mb-1">{doc.type}</Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(doc.url, '_blank')}
                    >
                      View Document <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No legal terms available.</p>
          )}
        </CardContent>
      </Card>

      {/* Validity Terms */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Validity Terms</CardTitle>
        </CardHeader>
        <CardContent>
          {validityTerm ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-1">
                <p className="text-sm text-muted-foreground">Type:</p>
                <p>{validityTerm.validityTerm.type}</p>
              </div>
              
              {validityTerm.validityTerm.agreementDuration && (
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-sm text-muted-foreground">Agreement Duration:</p>
                  <p>{formatDuration(validityTerm.validityTerm.agreementDuration)}</p>
                </div>
              )}
              
              {validityTerm.validityTerm.agreementEndDate && (
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-sm text-muted-foreground">Agreement End Date:</p>
                  <p>{format(parseISO(validityTerm.validityTerm.agreementEndDate), 'MMM d, yyyy')}</p>
                </div>
              )}
              
              {/* Calculate and display duration from agreement summary if available */}
              {!validityTerm.validityTerm.agreementDuration && agreement.summary?.startTime && agreement.summary?.endTime && (
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-sm text-muted-foreground">Duration:</p>
                  <p>
                    {Math.ceil(
                      (new Date(agreement.summary.endTime).getTime() - 
                       new Date(agreement.summary.startTime).getTime()) / 
                      (1000 * 60 * 60 * 24)
                    )} days
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No validity terms available.</p>
          )}
        </CardContent>
      </Card>

      {/* Pricing Terms */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Pricing Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={getDefaultTab()} className="w-full">
            <TabsList className={`grid w-full ${getTabsGridClass()}`}>
              {usageBasedPricingTerm && <TabsTrigger value="usage-based">Usage Based</TabsTrigger>}
              {fixedUpfrontPricingTerm && <TabsTrigger value="fixed-upfront">Fixed Upfront</TabsTrigger>}
              {paymentScheduleTerm && <TabsTrigger value="payment-schedule">Payment Schedule</TabsTrigger>}
              {!usageBasedPricingTerm && !fixedUpfrontPricingTerm && !paymentScheduleTerm && 
                <TabsTrigger value="payment-schedule">No Pricing Terms</TabsTrigger>}
            </TabsList>
            
            {/* Usage Based Pricing Terms */}
            <TabsContent value="usage-based">
              {usageBasedPricingTerm ? (
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Term ID:</p>
                    <p className="font-mono text-xs break-all">{usageBasedPricingTerm.usageBasedPricingTerm.id}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Currency:</p>
                    <p>{usageBasedPricingTerm.usageBasedPricingTerm.currencyCode}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Type:</p>
                    <p>{usageBasedPricingTerm.usageBasedPricingTerm.type}</p>
                  </div>
                  
                  {usageBasedPricingTerm.usageBasedPricingTerm.rateCards && 
                    usageBasedPricingTerm.usageBasedPricingTerm.rateCards.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Rate Card:</p>
                      <div className="border rounded-md overflow-hidden">
                        <div className="grid grid-cols-2 bg-muted p-2 font-medium text-sm">
                          <div>Dimension</div>
                          <div>Price</div>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {usageBasedPricingTerm.usageBasedPricingTerm.rateCards[0].rateCard
                            .slice(0, 10) // Show first 10 items to avoid overwhelming the UI
                            .map((rate: any, index: number) => (
                            <div key={index} className="grid grid-cols-2 p-2 text-sm border-t">
                              <div className="font-mono">{rate.dimensionKey}</div>
                              <div>{rate.price}</div>
                            </div>
                          ))}
                          {usageBasedPricingTerm.usageBasedPricingTerm.rateCards[0].rateCard.length > 10 && (
                            <div className="p-2 text-center text-sm text-muted-foreground border-t">
                              + {usageBasedPricingTerm.usageBasedPricingTerm.rateCards[0].rateCard.length - 10} more dimensions
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground pt-4">No usage-based pricing terms available.</p>
              )}
            </TabsContent>
            
            {/* Fixed Upfront Pricing Terms */}
            <TabsContent value="fixed-upfront">
              {fixedUpfrontPricingTerm ? (
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Term ID:</p>
                    <p className="font-mono text-xs break-all">{fixedUpfrontPricingTerm.fixedUpfrontPricingTerm.id}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Currency:</p>
                    <p>{fixedUpfrontPricingTerm.fixedUpfrontPricingTerm.currencyCode}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Price:</p>
                    <p>{fixedUpfrontPricingTerm.fixedUpfrontPricingTerm.price}</p>
                  </div>
                  {fixedUpfrontPricingTerm.fixedUpfrontPricingTerm.duration && (
                    <div className="grid grid-cols-2 gap-1">
                      <p className="text-sm text-muted-foreground">Duration:</p>
                      <p>{formatDuration(fixedUpfrontPricingTerm.fixedUpfrontPricingTerm.duration)}</p>
                    </div>
                  )}
                  
                  {/* Display grants */}
                  {fixedUpfrontPricingTerm.fixedUpfrontPricingTerm.grants && 
                    fixedUpfrontPricingTerm.fixedUpfrontPricingTerm.grants.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Grants:</p>
                      <div className="border rounded-md overflow-hidden">
                        <div className="grid grid-cols-2 bg-muted p-2 font-medium text-sm">
                          <div>Dimension</div>
                          <div>Max Quantity</div>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {fixedUpfrontPricingTerm.fixedUpfrontPricingTerm.grants.map((grant: any, index: number) => (
                            <div key={index} className="grid grid-cols-2 p-2 text-sm border-t">
                              <div className="font-mono">{grant.dimensionKey}</div>
                              <div>{grant.maxQuantity}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground pt-4">No fixed upfront pricing terms available.</p>
              )}
            </TabsContent>
            
            {/* Payment Schedule Terms */}
            <TabsContent value="payment-schedule">
              {paymentScheduleTerm ? (
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Currency:</p>
                    <p>{paymentScheduleTerm.paymentScheduleTerm.currencyCode}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">Type:</p>
                    <p>{paymentScheduleTerm.paymentScheduleTerm.type}</p>
                  </div>
                  
                  {/* Display payment schedule */}
                  {paymentScheduleTerm.paymentScheduleTerm.schedule && 
                    paymentScheduleTerm.paymentScheduleTerm.schedule.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Payment Schedule:</p>
                      <div className="border rounded-md overflow-hidden">
                        <div className="grid grid-cols-2 bg-muted p-2 font-medium text-sm">
                          <div>Charge Date</div>
                          <div>Amount ({paymentScheduleTerm.paymentScheduleTerm.currencyCode})</div>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {paymentScheduleTerm.paymentScheduleTerm.schedule.map((payment: any, index: number) => (
                            <div key={index} className="grid grid-cols-2 p-2 text-sm border-t">
                              <div>{format(parseISO(payment.chargeDate), 'MMM d, yyyy')}</div>
                              <div className="font-medium">{Number(payment.chargeAmount).toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Total amount if multiple payments */}
                      {paymentScheduleTerm.paymentScheduleTerm.schedule.length > 1 && (
                        <div className="mt-2 text-right">
                          <p className="text-sm font-medium">
                            Total: {paymentScheduleTerm.paymentScheduleTerm.currencyCode} {' '}
                            {paymentScheduleTerm.paymentScheduleTerm.schedule
                              .reduce((sum: number, payment: any) => sum + Number(payment.chargeAmount), 0)
                              .toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground pt-4">No payment schedule terms available.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsTab;
