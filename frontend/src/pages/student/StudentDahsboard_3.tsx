import { 
  Avatar, 
  Button, 
  Card, 
  Chip, 
  Input, 
  ProgressBar, 
  ProgressCircle,
  
} from "@heroui/react";
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Trophy,
  Settings,
  LogOut,
  MessageSquare,
  Briefcase,
  Search,
  MapPin,
  BellDot,
  AlertCircle,
  Clock,
  ChevronRight,
  CheckCircle2,
  Activity,
} from "lucide-react";

const cardShadowClass = "shadow-[0_20px_50px_rgba(93,69,253,0.06)] border-none";

export default function StudentDashboard() {
  return (
    <div className="flex h-screen bg-[#5D45FD] p-3 gap-2 overflow-hidden font-sans antialiased">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-24 flex flex-col items-center py-8 gap-10 text-white/40">
        <div className="bg-white/20 p-4 rounded-[2rem] text-white shadow-2xl backdrop-blur-xl border border-white/20">
          <Briefcase size={28} strokeWidth={2.5} />
        </div>

        <nav className="flex flex-col gap-9">
          {[
            { icon: LayoutDashboard, active: true },
            { icon: BookOpen },
            { icon: CalendarCheck },
            { icon: MessageSquare },
            { icon: Trophy },
            { icon: Settings },
          ].map((item, idx) => (
            <div
              key={idx}
              className={
                item.active
                  ? "text-white scale-110"
                  : "hover:text-white cursor-pointer transition-all hover:scale-110"
              }
            >
              <item.icon size={26} strokeWidth={item.active ? 2.5 : 1.5} />
            </div>
          ))}
        </nav>

        <div className="mt-auto mb-4">
          <LogOut size={26} className="hover:text-red-400 cursor-pointer transition-colors" />
        </div>
      </aside>

      {/* --- MAIN OS CONTAINER --- */}
      <main className="flex-1 bg-white rounded-[3.5rem] shadow-2xl flex overflow-hidden border-[12px] border-white/10">

        {/* --- LEFT SECTION --- */}
        <section className="flex-1 p-10 overflow-y-auto border-r border-slate-100 no-scrollbar">
          
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">
                Hello, Dishant <span className="not-italic">👋</span>
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                B.Tech 3rd Year • Ghaziabad, UP
              </p>
            </div>
            <div className="flex gap-3">
              <Input
                radius="full"
                placeholder="Search protocols..."
                startContent={<Search className="text-slate-400" size={18} />}
                className="max-w-[240px]"
                classNames={{ 
                  inputWrapper: "bg-slate-100 border-none shadow-none",
                  input: "font-bold text-sm"
                }}
              />
              <Button isIconOnly radius="full" className="bg-slate-100 text-slate-600">
                <BellDot size={20} />
              </Button>
            </div>
          </header>

          <div className="space-y-12">
            
            {/* 1. ALERTS & ACTION CENTER */}
            <div>
              <div className="flex justify-between items-end mb-5">
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Action Center</h2>
                <span className="text-[10px] font-black text-[#5D45FD] uppercase tracking-widest cursor-pointer">Clear All</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-red-50 border-none shadow-none rounded-[2rem]">
                  <Card.Body className="flex flex-row items-center gap-4 p-5">
                    <div className="bg-red-500 text-white p-3 rounded-2xl shadow-lg shadow-red-200 shrink-0">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-red-900 text-sm italic leading-tight">Overdue Homework</h4>
                      <p className="text-red-700/60 text-xs font-bold">Physics: Quantum Mechanics</p>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="bg-amber-50 border-none shadow-none rounded-[2rem]">
                  <Card.Body className="flex flex-row items-center gap-4 p-5">
                    <div className="bg-amber-500 text-white p-3 rounded-2xl shadow-lg shadow-amber-200 shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-amber-900 text-sm italic leading-tight">Pending Submission</h4>
                      <p className="text-amber-700/60 text-xs font-bold">Maths: Due in 4 hours</p>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>

            {/* 3. SUBJECT SNAPSHOT */}
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-5">Subject Snapshot</h2>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { name: "Fluid Mechanics", tasks: 2, last: "Yesterday", color: "bg-blue-500" },
                  { name: "Digital Electronics", tasks: 0, last: "Today", color: "bg-purple-500" },
                  { name: "Thermodynamics", tasks: 1, last: "2 days ago", color: "bg-emerald-500" },
                ].map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.8rem] hover:bg-slate-100 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${sub.color}`} />
                      <div>
                        <h4 className="font-bold text-slate-800">{sub.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Last Class: {sub.last}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {sub.tasks > 0 && <Chip size="sm" className="bg-red-100 text-red-600 font-black text-[10px] uppercase">{sub.tasks} Pending</Chip>}
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-[#5D45FD] transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. QUICK ACTIONS */}
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-5">Quick Access</h2>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Timetable", icon: CalendarCheck, bg: "bg-indigo-50", text: "text-indigo-600" },
                  { label: "Homework", icon: BookOpen, bg: "bg-rose-50", text: "text-rose-600" },
                  { label: "Results", icon: Trophy, bg: "bg-amber-50", text: "text-amber-600" },
                  { label: "Messages", icon: MessageSquare, bg: "bg-cyan-50", text: "text-cyan-600" },
                ].map((act, i) => (
                  <button key={i} className={`${act.bg} ${act.text} p-6 rounded-[2.2rem] flex flex-col items-center gap-3 hover:scale-105 transition-transform shadow-sm`}>
                    <act.icon size={28} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{act.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* --- RIGHT ANALYTICS SECTION --- */}
        <section className="w-[420px] bg-slate-50/50 p-10 flex flex-col gap-8 overflow-y-auto no-scrollbar">
          
          {/* PROFILE CARD */}
          <Card className={`${cardShadowClass} rounded-[3rem] p-4 bg-white`}>
            <Card.Body className="text-center space-y-4">
              <div className="relative w-fit mx-auto">
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dishant" className="w-28 h-28 border-4 border-slate-50 shadow-xl" />
                <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 italic">Dishant Pandey</h3>
                <div className="flex justify-center items-center gap-1 text-slate-400 font-bold text-xs mt-1">
                  <MapPin size={14} /> Ghaziabad, UP
                </div>
              </div>
              <Button fullWidth radius="xl" className="bg-[#5D45FD] text-white font-black uppercase tracking-widest text-[11px] h-12 shadow-lg shadow-indigo-200">
                Edit Profile
              </Button>
            </Card.Body>
          </Card>

          {/* 2. ATTENDANCE ANALYTICS */}
          <Card className={`${cardShadowClass} rounded-[3rem] p-6 bg-white overflow-hidden relative`}>
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Activity size={80} />
            </div>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Attendance Metric</h4>
            <div className="flex flex-col items-center gap-4">
               <div className="relative flex items-center justify-center">
                 <ProgressCircle
                    aria-label="Attendance Indicator"
                    size="lg"
                    value={82}
                    color="primary"
                    className="w-40 h-40"
                    classNames={{
                      svg: "w-32 h-32 drop-shadow-md",
                      indicator: "stroke-[#5D45FD]",
                      track: "stroke-slate-100",
                    }}
                  />
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-slate-900 italic">82%</span>
                    <span className="text-[9px] font-black text-green-500 uppercase">Above Avg</span>
                  </div>
               </div>
               <p className="text-center text-xs text-slate-500 font-medium px-4">
                 You have missed <span className="text-slate-900 font-black italic">4 classes</span> this month. Keep it up!
               </p>
            </div>
          </Card>

          {/* 5. RECENT ACTIVITY FEED */}
          <div>
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { text: "Homework submitted", sub: "Fluid Mechanics", icon: CheckCircle2, color: "text-green-500" },
                { text: "New Notice added", sub: "Holiday on 15th Aug", icon: BellDot, color: "text-blue-500" },
                { text: "Teacher Commented", sub: "Excellent Work in Lab", icon: MessageSquare, color: "text-purple-500" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start p-2">
                  <div className={`${item.color} mt-1`}><item.icon size={18} /></div>
                  <div>
                    <h5 className="text-[13px] font-black text-slate-800 tracking-tight">{item.text}</h5>
                    <p className="text-[11px] text-slate-400 font-bold uppercase">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}