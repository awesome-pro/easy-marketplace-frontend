'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AlertCircle, CalendarIcon, DollarSign, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

interface TermsTabProps {
  offer: any;
}

// Define types for terms to match the AWS offer interface
type AwsDocument = {
  Name: string;
  Url: string;
  Status?: string;
  Type?: string;
  Version?: string;
};

type AwsGrant = {
  Name: string;
  MaxQuantity?: number;
  MinQuantity?: number;
};

type AwsRate = {
  Currency?: string;
  Price?: number;
  Unit?: string;
  Description?: string;
  BeginRange?: number;
  EndRange?: number;
  RateType?: string;
};

type AwsRateCard = {
  Name?: string;
  Type?: string;
  Rates?: AwsRate[];
};

type AwsScheduleItem = {
  Amount: number;
  Currency: string;
  ChargeDate: string;
  Description?: string;
  ChargeAmount?: number;
};

export function TermsTab({ offer }: TermsTabProps) {
  // Helper function to format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP');
  };

  // Extract terms by type
  const legalTerms = offer.Terms?.filter((term: { Type: string; }) => term.Type === 'LegalTerm') || [];
  const pricingTerms = offer.Terms?.filter((term: { Type: string; }) => 
    term.Type === 'FixedUpfrontPricingTerm' || 
    term.Type === 'UsageBasedPricingTerm' ||
    term.Type === 'ConfigurableUpfrontPricingTerm'
  ) || [];
  const validityTerms = offer.Terms?.filter((term: { Type: string; }) => term.Type === 'ValidityTerm') || [];
  const paymentScheduleTerms = offer.Terms?.filter((term: { Type: string; }) => term.Type === 'PaymentScheduleTerm') || [];
  const supportTerms = offer.Terms?.filter((term: { Type: string; }) => term.Type === 'SupportTerm') || [];
  const renewalTerms = offer.Terms?.filter((term: { Type: string; }) => term.Type === 'RenewalTerm') || [];

  return (
    <div className="space-y-6">
      {/* Legal Terms */}
      {legalTerms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Legal Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {legalTerms.map((term: { Documents: any[]; }, index: any) => (
              <div key={`legal-${index}`} className="space-y-3">
                {term.Documents?.map((doc: { Type: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; Version: any; Url: string | URL | undefined; }, docIndex: any) => (
                  <div key={`doc-${docIndex}`} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {doc.Type === 'CustomEula' ? 'Custom EULA' : 
                         doc.Type === 'StandardEula' ? 'Standard EULA' : doc.Type}
                        {doc.Version && ` (Version: ${doc.Version})`}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(doc.Url, '_blank')}
                      >
                        View Document
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Pricing Terms */}
      {pricingTerms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" /> Pricing Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {pricingTerms.map((term: { Type: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; CurrencyCode: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; Duration: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; Price: any; Grants: any[]; RateCards: any[]; }, index: any) => (
              <div key={`pricing-${index}`} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{term.Type}</Badge>
                  {term.CurrencyCode && (
                    <Badge>{term.CurrencyCode}</Badge>
                  )}
                  {term.Duration && (
                    <Badge variant="secondary">Duration: {term.Duration}</Badge>
                  )}
                </div>

                {/* Fixed Upfront Pricing */}
                {term.Type === 'FixedUpfrontPricingTerm' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Price</p>
                      <p>{term.Price || '0'} {term.CurrencyCode}</p>
                    </div>
                    
                    {term.Grants && term.Grants.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Grants</p>
                        <div className="space-y-2">
                          {term.Grants.map((grant: { DimensionKey: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; MaxQuantity: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, grantIndex: any) => (
                            <div key={`grant-${grantIndex}`} className="flex items-center justify-between">
                              <p className="text-sm">{grant.DimensionKey}</p>
                              <p>Max Quantity: {grant.MaxQuantity}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Usage Based Pricing */}
                {term.Type === 'UsageBasedPricingTerm' && term.RateCards && (
                  <Accordion type="single" collapsible className="w-full">
                    {term.RateCards.map((rateCard: { RateCard: any[]; }, rcIndex: number) => (
                      <AccordionItem key={`rc-${rcIndex}`} value={`rc-${rcIndex}`}>
                        <AccordionTrigger>Rate Card {rcIndex + 1}</AccordionTrigger>
                        <AccordionContent>
                          {rateCard.RateCard && rateCard.RateCard.length > 0 && (
                            <div className="space-y-2 mt-2">
                              <div className="grid grid-cols-2 font-medium">
                                <p>Dimension</p>
                                <p>Price ({term.CurrencyCode})</p>
                              </div>
                              <Separator />
                              {rateCard.RateCard.map((rate: { DimensionKey: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; Price: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, rateIndex: any) => (
                                <div key={`rate-${rateIndex}`} className="grid grid-cols-2">
                                  <p className="text-sm">{rate.DimensionKey}</p>
                                  <p>{rate.Price}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}

                {/* Configurable Upfront Pricing */}
                {term.Type === 'ConfigurableUpfrontPricingTerm' && term.RateCards && (
                  <Accordion type="single" collapsible className="w-full">
                    {term.RateCards.map((rateCard: { Selector: { Type: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; Value: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; Constraints: { MultipleDimensionSelection: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; QuantityConfiguration: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; RateCard: any[]; }, rcIndex: any) => (
                      <AccordionItem key={`rc-${rcIndex}`} value={`rc-${rcIndex}`}>
                        <AccordionTrigger>
                          {rateCard.Selector?.Type}: {rateCard.Selector?.Value}
                        </AccordionTrigger>
                        <AccordionContent>
                          {rateCard.Constraints && (
                            <div className="mb-2 p-2 bg-muted rounded-md">
                              <p className="text-sm font-medium">Constraints:</p>
                              <p className="text-sm">Multiple Dimension Selection: {rateCard.Constraints.MultipleDimensionSelection}</p>
                              <p className="text-sm">Quantity Configuration: {rateCard.Constraints.QuantityConfiguration}</p>
                            </div>
                          )}
                          
                          {rateCard.RateCard && rateCard.RateCard.length > 0 && (
                            <div className="space-y-2 mt-2">
                              <div className="grid grid-cols-2 font-medium">
                                <p>Dimension</p>
                                <p>Price ({term.CurrencyCode})</p>
                              </div>
                              <Separator />
                              {rateCard.RateCard.map((rate: { DimensionKey: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; Price: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, rateIndex: any) => (
                                <div key={`rate-${rateIndex}`} className="grid grid-cols-2">
                                  <p className="text-sm">{rate.DimensionKey}</p>
                                  <p>{rate.Price}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Validity Terms */}
      {validityTerms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" /> Validity Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {validityTerms.map((term: { AgreementDuration: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: any) => (
              <div key={`validity-${index}`} className="space-y-2">
                <p className="text-sm font-medium">Agreement Duration</p>
                <p>{term.AgreementDuration}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Payment Schedule Terms */}
      {paymentScheduleTerms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" /> Payment Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentScheduleTerms.map((term: { CurrencyCode: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; Schedule: any[]; }, index: any) => (
              <div key={`payment-${index}`} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge>{term.CurrencyCode}</Badge>
                </div>
                
                {term.Schedule && term.Schedule.length > 0 && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 font-medium">
                      <p>Charge Date</p>
                      <p>Amount ({term.CurrencyCode})</p>
                    </div>
                    <Separator />
                    {term.Schedule.map((item: { ChargeDate: string | undefined; ChargeAmount: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, scheduleIndex: any) => (
                      <div key={`schedule-${scheduleIndex}`} className="grid grid-cols-2">
                        <p>{formatDate(item.ChargeDate)}</p>
                        <p>{item.ChargeAmount}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Support Terms */}
      {supportTerms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" /> Support Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {supportTerms.map((term: { RefundPolicy: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: any) => (
              <div key={`support-${index}`} className="space-y-2">
                {term.RefundPolicy && (
                  <div>
                    <p className="text-sm font-medium">Refund Policy</p>
                    <p>{term.RefundPolicy}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Renewal Terms */}
      {renewalTerms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Renewal Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>This offer includes renewal terms.</p>
          </CardContent>
        </Card>
      )}

      {/* No Terms */}
      {!offer.Terms || offer.Terms.length === 0 && (
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">No terms information available for this offer.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
