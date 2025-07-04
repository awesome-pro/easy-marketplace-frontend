"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "./overview-tab";
import TermsTab from "./terms-tab";
import ResourcesTab from "./resources-tab";
import ActionsTab from "./actions-tab";

interface AgreementTabsProps {
  agreement: any; // Using any temporarily, will be properly typed later
}

const AgreementTabs = ({ agreement }: AgreementTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="terms">Terms</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="actions">Actions</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <OverviewTab agreement={agreement} />
      </TabsContent>
      <TabsContent value="terms">
        <TermsTab agreement={agreement} />
      </TabsContent>
      <TabsContent value="resources">
        <ResourcesTab agreement={agreement} />
      </TabsContent>
      <TabsContent value="actions">
        <ActionsTab agreement={agreement} />
      </TabsContent>
    </Tabs>
  );
};

export default AgreementTabs;
