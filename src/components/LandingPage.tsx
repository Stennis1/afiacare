import { clinicImageUrl, heroImageUrl } from '../data/appContent';

interface LandingPageProps {
  onStartVoiceDemo: () => void;
  onViewDashboard: () => void;
}

export function LandingPage({ onStartVoiceDemo, onViewDashboard }: LandingPageProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-white/5 shadow-xl shadow-slate-950/20">
        <img
          src={heroImageUrl}
          alt="Adult pregnant woman in Ghana"
          className="h-[420px] w-full object-cover object-top sm:h-[520px]"
        />
        <div className="p-8">
          <p className="text-sky-300 uppercase tracking-[0.4em]">AfiaCare</p>
          <h3 className="mt-6 text-4xl font-bold text-white">Saving Mothers. One Voice at a Time.</h3>
          <p className="mt-4 max-w-xl text-slate-300">
            A maternal health companion for pregnant women in rural communities, helping them
            speak in local languages and receive clear next steps.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={onStartVoiceDemo}
              className="rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Start Voice Demo
            </button>
            <button
              onClick={onViewDashboard}
              className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-slate-950/30">
        <img
          src={clinicImageUrl}
          alt="Black Ghanaian nurse attending to an adult pregnant woman"
          className="h-64 w-full object-cover"
        />
        <div className="p-8">
          <h4 className="text-xl font-semibold text-white">Demo highlights</h4>
          <ul className="mt-6 space-y-4 text-slate-300">
            <li>• USSD-style risk triage with AI service layer</li>
            <li>• CHW patient prioritization sorted by risk</li>
            <li>• District metric cards and bar chart</li>
            <li>• Rebuilt on Next.js for a production-grade foundation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
