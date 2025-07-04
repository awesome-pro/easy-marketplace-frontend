import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, Ban, Clock } from "lucide-react";

interface AgreementHeaderProps {
  agreement: any; // Using any temporarily, will be properly typed later
}

const AgreementHeader = ({ agreement }: AgreementHeaderProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            ACTIVE
          </Badge>
        );
      case "EXPIRED":
        return <Badge variant="secondary">EXPIRED</Badge>;
      case "CANCELLED":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Ban className="h-3 w-3" />
            CANCELLED
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  // Extract data from agreement
  const { summary } = agreement;
  const status = summary?.status || "UNKNOWN";
  const startTime = summary?.startTime;
  const acceptanceTime = summary?.acceptanceTime;
  const resourceId = summary?.proposalSummary?.resources?.[0]?.id;
  const resourceType = summary?.proposalSummary?.resources?.[0]?.type;
  const offerId = summary?.proposalSummary?.offerId;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold">
                {resourceId || "Unknown Product"}
              </h2>
              {getStatusBadge(status)}
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Agreement ID: {summary?.agreementId}</p>
              <p>Offer ID: {offerId}</p>
              {resourceType && <p>Type: {resourceType}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>Start Date: {formatDate(startTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Accepted: {formatDate(acceptanceTime)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgreementHeader;
