import PageHeader from "@/components/layout/PageHeader";
import EarthLinkChip from "@/components/layout/EarthLinkChip";
import HeartRateCard from "./HeartRateCard";
import VitalCards from "./VitalCards";
import SignalsTable from "./SignalsTable";
import ScenarioCard from "./ScenarioCard";

export default function OverviewView() {
  return (
    <div className="space-y-7">
      <PageHeader title="Overview">
        <EarthLinkChip />
      </PageHeader>

      <section className="grid gap-6 lg:grid-cols-[5fr_6fr]">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">Live heart rate</h2>
          <div className="flex-1"><HeartRateCard /></div>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">Your vitals</h2>
          <div className="flex-1"><VitalCards /></div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <SignalsTable />
        <ScenarioCard />
      </section>

      <p className="text-center text-[11px] text-muted md:text-left md:text-xs">
        Prototype, not a medical device. Heart rate is measured live; sleep and radiation are simulated.
      </p>
    </div>
  );
}