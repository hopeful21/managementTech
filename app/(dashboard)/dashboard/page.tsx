import { Activity, CalendarDays, DollarSign, UsersRound } from "lucide-react";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PageHeading } from "@/components/app/page-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { attendance, employees, financeRecords, recentActivities } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const income = financeRecords.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expense = financeRecords.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <PageHeading title="Executive Dashboard" description="Company pulse, finance analytics, attendance, and latest operational movement in one workspace." />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Monthly revenue", value: formatCurrency(income), icon: DollarSign, tone: "indigo" },
          { label: "Operating cost", value: formatCurrency(expense), icon: Activity, tone: "cyan" },
          { label: "Employees", value: employees.length.toString(), icon: UsersRound, tone: "green" },
          { label: "Present today", value: attendance.filter((item) => item.status !== "late").length.toString(), icon: CalendarDays, tone: "amber" }
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              </div>
              <div className="rounded-2xl bg-muted p-3">
                <stat.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
      <section id="analytics" className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Income vs expense</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity stream</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-7 gap-2 text-center text-sm">
              {Array.from({ length: 14 }, (_, index) => (
                <div key={index} className="rounded-xl bg-muted p-2">
                  {index + 1}
                </div>
              ))}
              <Badge tone="cyan" className="col-span-7 justify-center">Board review on May 14</Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
