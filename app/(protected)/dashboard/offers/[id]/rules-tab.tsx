'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AwsOffer } from '@/services/offers-aws.api';
import { format } from 'date-fns';
import { AlertCircle, CalendarRange, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface RulesTabProps {
  offer: AwsOffer;
}

export function RulesTab({ offer }: RulesTabProps) {
  // Helper function to format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP');
  };
  // Extract rules by type
  const availabilityRules = offer.Rules?.filter(rule => rule.Type === 'AvailabilityRule') || [];
  const targetingRules = offer.Rules?.filter(rule => rule.Type === 'TargetingRule') || [];

  return (
    <div className="space-y-6">
      {/* Availability Rules */}
      {availabilityRules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5" /> Availability Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {availabilityRules.map((rule, index) => (
              <div key={`availability-${index}`} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Availability End Date</p>
                  <Badge variant="outline" className="ml-2">
                    {formatDate(rule.AvailabilityEndDate)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  This offer will be available until the specified end date.
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Targeting Rules */}
      {targetingRules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Targeting Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {targetingRules.map((rule, index) => (
              <div key={`targeting-${index}`} className="space-y-4">
                {/* Positive Targeting */}
                {rule.PositiveTargeting && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Positive Targeting</p>
                      <p className="text-sm text-muted-foreground">
                        This offer is specifically targeted to the following accounts:
                      </p>
                    </div>

                    {/* Buyer Accounts */}
                    {rule.PositiveTargeting.BuyerAccounts && rule.PositiveTargeting.BuyerAccounts.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Buyer Accounts</p>
                        <div className="flex flex-wrap gap-2">
                          {rule.PositiveTargeting.BuyerAccounts.map((account, accountIndex) => (
                            <Badge key={`account-${accountIndex}`} variant="outline">
                              {account}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Negative Targeting */}
                {rule.NegativeTargeting && (
                  <div className="space-y-3 mt-4">
                    <div>
                      <p className="text-sm font-medium">Negative Targeting</p>
                      <p className="text-sm text-muted-foreground">
                        This offer is excluded from the following accounts:
                      </p>
                    </div>

                    {/* Buyer Accounts */}
                    {rule.NegativeTargeting.BuyerAccounts && rule.NegativeTargeting.BuyerAccounts.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Excluded Buyer Accounts</p>
                        <div className="flex flex-wrap gap-2">
                          {rule.NegativeTargeting.BuyerAccounts.map((account, accountIndex) => (
                            <Badge key={`neg-account-${accountIndex}`} variant="outline" className="border-red-500 text-red-500">
                              {account}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Rules */}
      {(!offer.Rules || offer.Rules.length === 0) && (
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">No rules information available for this offer.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
