import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResourcesTabProps {
  agreement: any; // Using any temporarily, will be properly typed later
}

const ResourcesTab = ({ agreement }: ResourcesTabProps) => {
  const { details } = agreement;
  const resources = details?.resources || [];

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Offer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-1">
            <p className="text-sm text-muted-foreground">Offer ID:</p>
            <p className="font-medium">{details?.offerId || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <CardContent>
          {resources.length > 0 ? (
            <div className="space-y-4">
              {resources.map((resource: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Resource {index + 1}</h3>
                    <Badge>{resource.type}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-muted-foreground">ID:</p>
                    <p className="font-mono text-sm">{resource.id}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No resources available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesTab;
