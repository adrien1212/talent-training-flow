// components/SessionEnrollmentTabs.tsx
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import useSessionEnrollments from '@/hooks/useSessionEnrollments';
import EnrollmentsTable from './EnrollmentsTable';
import { SessionStatus } from '@/types/SessionStatus';

interface Props {
    trainingId?: number;
    sessionId?: number;
}

const TABS = [
    { key: 'all', label: 'Tous', status: null, showSessionStatus: true },
    { key: 'current', label: 'En cours', status: SessionStatus.Active, showSessionStatus: false },
    { key: 'completed', label: 'Terminé', status: SessionStatus.Completed, showSessionStatus: false },
    { key: 'scheduled', label: 'Programmé', status: SessionStatus.NotStarted, showSessionStatus: false },
] as const;

const TrainingSessionEnrollmentTabs: React.FC<Props> = ({ trainingId, sessionId }) => {
    const [pageByTab, setPageByTab] = useState<Record<string, number>>({
        all: 0,
        current: 0,
        completed: 0,
        scheduled: 0,
    });
    const activeTabDefault = 'all';

    return (
        <Tabs defaultValue={activeTabDefault} className="w-full">
            <TabsList>
                {TABS.map(t => (
                    <TabsTrigger key={t.key} value={t.key}>
                        {t.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {TABS.map(tab => {
                const page = pageByTab[tab.key];
                const { data, isLoading } = useSessionEnrollments({
                    trainingId,
                    sessionId,
                    status: tab.status,
                    page,
                });
                return (
                    <TabsContent key={tab.key} value={tab.key}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Participants {tab.label.toLowerCase()}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <EnrollmentsTable
                                    items={data?.content ?? []}
                                    page={page}
                                    totalPages={data?.totalPages ?? 1}
                                    loading={isLoading}
                                    showSessionStatus={tab.showSessionStatus}
                                    onPageChange={newPage =>
                                        setPageByTab(prev => ({ ...prev, [tab.key]: newPage }))
                                    }
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                );
            })}
        </Tabs>
    );
};

export default TrainingSessionEnrollmentTabs;