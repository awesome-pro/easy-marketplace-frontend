import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface OverviewTabProps {
  agreement: any; // Using any temporarily, will be properly typed later
}

const OverviewTab = ({ agreement }: OverviewTabProps) => {
  const { summary, metadata } = agreement;
  
  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(parseISO(dateString), "PPP 'at' p");
  };

  // Calculate duration if start and end time are available
  const calculateDuration = () => {
    if (summary?.startTime && summary?.endTime) {
      const startDate = new Date(summary.startTime);
      const endDate = new Date(summary.endTime);
      const durationMs = endDate.getTime() - startDate.getTime();
      const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24));
      return `${durationDays} days`;
    }
    return "N/A";
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Agreement Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-2">
            <div className="grid grid-cols-2 gap-1">
              <dt className="font-medium text-muted-foreground">ID:</dt>
              <dd>{summary?.agreementId}</dd>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <dt className="font-medium text-muted-foreground">Type:</dt>
              <dd>{summary?.agreementType}</dd>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <dt className="font-medium text-muted-foreground">Status:</dt>
              <dd><Badge variant="success">{summary?.status}</Badge></dd>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <dt className="font-medium text-muted-foreground">Start Date:</dt>
              <dd>{formatDate(summary?.startTime)}</dd>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <dt className="font-medium text-muted-foreground">End Date:</dt>
              <dd>{formatDate(summary?.endTime)}</dd>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <dt className="font-medium text-muted-foreground">Duration:</dt>
              <dd>{calculateDuration()}</dd>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <dt className="font-medium text-muted-foreground">Acceptance Date:</dt>
              <dd>{formatDate(summary?.acceptanceTime)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Parties</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4">
            <div>
              <dt className="font-medium">Proposer</dt>
              <dd className="text-sm text-muted-foreground">
                <div>Account ID: {summary?.proposer?.accountId}</div>
                {summary?.proposer?.name && <div>Name: {summary.proposer.name}</div>}
                {summary?.proposer?.email && <div>Email: {summary.proposer.email}</div>}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Acceptor</dt>
              <dd className="text-sm text-muted-foreground">
                <div>Account ID: {summary?.acceptor?.accountId}</div>
                {summary?.acceptor?.name && <div>Name: {summary.acceptor.name}</div>}
                {summary?.acceptor?.email && <div>Email: {summary.acceptor.email}</div>}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-2">
            <div className="grid grid-cols-2 gap-1">
              <dt className="font-medium text-muted-foreground">Region:</dt>
              <dd>{metadata?.region || "N/A"}</dd>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <dt className="font-medium text-muted-foreground">Fetched At:</dt>
              <dd>{formatDate(metadata?.fetchedAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
