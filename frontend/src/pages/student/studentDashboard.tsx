import { Avatar, Button, Card, Chip, Input, ProgressBar } from "@heroui/react";
import { LayoutDashboard, BookOpen, CalendarCheck, Trophy, Settings, LogOut, MessageSquare, Briefcase, Search, MapPin, Target, BellDot, Zap } from 'lucide-react';

// Common style for your 3D cards
const cardShadowClass = "shadow-[0_20px_50px_rgba(93,69,253,0.08)] border-none";

export default function StudentDashboard() {
  return (
    <div className="flex h-screen bg-[#5D45FD] p-3 gap-2 overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-20 flex flex-col items-center py-8 gap-10 text-white/50">
        <div className="bg-white/20 p-3 rounded-2xl text-white shadow-xl backdrop-blur-md">
          <Briefcase size={28} />
        </div>
        <nav className="flex flex-col gap-8">
          {[
            { icon: LayoutDashboard, active: true },
            { icon: BookOpen },
            { icon: CalendarCheck },
            { icon: MessageSquare },
            { icon: Trophy },
            { icon: Briefcase },
            { icon: Settings },
          ].map((item, idx) => (
            <div key={idx} className={item.active ? 'text-white' : 'hover:text-white cursor-pointer transition-colors'}>
              <item.icon size={24} />
            </div>
          ))}
        </nav>
        <div className="mt-auto">
          <LogOut size={24} className="hover:text-white cursor-pointer" />
        </div>
      </aside>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="flex-1 bg-white rounded-[2.5rem] shadow-2xl flex overflow-hidden border-8 border-white/10">
        
        {/* --- LEFT SECTION (Courses) --- */}
        <section className="flex-1 p-12 overflow-y-auto border-r border-slate-100">
          <header className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight italic">Hello, Dishant 👋</h1>
              <p className="text-slate-400 mt-2 font-medium">B.Tech 3rd Year • Ghaziabad, UP</p>
            </div>
            <div className="flex items-center gap-3">
               <Input
                 isClearable
                 radius="full"
                 placeholder="Search subject..."
                 startContent={<Search className="text-slate-400" size={18} />}
                 className="max-w-[250px]"
               />
               <Button isIconOnly radius="full" variant="light" className="text-slate-400 bg-slate-100"><BellDot size={20}/></Button>
            </div>
          </header>

          <div className="space-y-10">
            <h2 className="text-2xl font-black text-slate-800">Today's course</h2>
            
            {/* Course Card 1: Biology */}
            <Card className={`${cardShadowClass} bg-slate-50/50 hover:bg-slate-50 transition-all rounded-[2.5rem] p-2`}>
              <Card.Content className="flex items-center p-4 gap-6">
                <div className="bg-white w-20 h-20 rounded-3xl shadow-sm flex items-center justify-center text-4xl">🧬</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-700">Biology Molecular</h3>
                  <div className="text-sm text-slate-400 font-medium flex gap-4 mt-2">
                    <p>21 lesson</p>
                    <p>5 assignment</p>
                    <p>312 students</p>
                  </div>
                </div>
                <div className="w-40 px-4 text-right">
                  <span className="text-sm font-bold text-green-500">79%</span>
                  <ProgressBar value={79} radius="full" color="success" size="sm" className="max-w-md mt-2" />
                </div>
                <div className="flex gap-2">
                   <Button radius="full" variant="bordered" color="default">Skip</Button>
                   <Button radius="full" variant="shadow" color="success">Continue</Button>
                </div>
              </Card.Content>
            </Card>

            {/* Course Card 2: Color Theory */}
            <Card className={`${cardShadowClass} bg-slate-50/50 hover:bg-slate-50 transition-all rounded-[2.5rem] p-2 opacity-70`}>
              <Card.Content className="flex items-center p-4 gap-6">
                <div className="bg-white w-20 h-20 rounded-3xl shadow-sm flex items-center justify-center text-4xl">🎨</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-700">Color Theory</h3>
                  <div className="text-sm text-slate-400 font-medium flex gap-4 mt-2">
                    <p>10 lesson</p>
                    <p>2 assignment</p>
                    <p>256 students</p>
                  </div>
                </div>
                <div className="w-40 px-4 text-right">
                  <span className="text-sm font-bold text-slate-500">64%</span>
                  <ProgressBar value={64} radius="full" color="default" size="sm" className="max-w-md mt-2" />
                </div>
                <div className="flex gap-2">
                   <Button radius="full" variant="bordered" color="default">Skip</Button>
                   <Button radius="full" variant="shadow" color="default" className="text-slate-600 bg-slate-200">Continue</Button>
                </div>
              </Card.Content>
            </Card>

            <h2 className="text-2xl font-black text-slate-800 mt-12">Your class</h2>
            <Card className={`${cardShadowClass} bg-amber-50 rounded-[2.5rem] p-4 border border-amber-100`}>
               <Card.Content className="flex items-center p-4 gap-6">
                   <div className="bg-white w-20 h-20 rounded-3xl shadow-sm flex items-center justify-center text-4xl">🦠</div>
                   <div className="flex-1 text-slate-700">
                       <h3 className="font-bold text-lg">Microbiology Society</h3>
                       <p className="text-slate-400 font-medium text-sm mt-1">Ghaziabad Chapter • B.Tech Batch B1</p>
                   </div>
                   <Chip startContent={<Zap size={14} />} color="warning" variant="shadow" className="font-bold">Active</Chip>
               </Card.Content>
            </Card>
          </div>
        </section>

        {/* --- RIGHT SECTION (Analytics) --- */}
        <section className="w-[420px] bg-slate-50/30 p-12 overflow-y-auto flex flex-col gap-10">
          
          {/* Profile Card */}
          <Card className={`${cardShadowClass} shadow-sm rounded-[3rem] p-6 text-center bg-white`}>
            <div className="relative inline-block mx-auto mb-4">
               <Avatar 
                 src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dishant" 
                 className="w-28 h-28 text-large mx-auto border-4 border-white shadow-2xl" 
               />
               <Chip color="secondary" variant="dot" className="absolute bottom-0 -right-2 font-bold uppercase text-[9px]">GZ-420</Chip>
            </div>
            <h3 className="text-2xl font-black text-slate-800">Dishant Pandey</h3>
            <div className="text-slate-400 font-bold mt-2 flex items-center gap-1 justify-center"><MapPin size={16}/> Ghaziabad, UP</div>
            <div className="flex justify-around mt-10 border-t pt-8 border-slate-100">
               <div><p className="font-bold text-slate-700 text-lg">24</p><p className="text-xs text-slate-400">Courses</p></div>
               <div className="w-px h-10 bg-slate-100"></div>
               <div><p className="font-bold text-slate-700 text-lg">18</p><p className="text-xs text-slate-400">Certificates</p></div>
            </div>
          </Card>

          {/* XP & Collect Card */}
          <Card className={`${cardShadowClass} shadow-sm bg-white p-8 rounded-[2rem] flex flex-row items-center gap-6`}>
              <Trophy size={60} color="#fab005" className="opacity-80" strokeWidth={1}/>
              <div className="flex-1">
                <p className="text-sm text-slate-400 font-black uppercase tracking-widest">Total XP</p>
                <h4 className="text-4xl font-black mt-1 text-[#5D45FD]">2400 XP</h4>
              </div>
              <Button color="secondary" radius="full" variant="solid" className="font-bold">Collect</Button>
          </Card>

          {/* Consultation and Target Buttons */}
          <div className="grid grid-cols-2 gap-4">
             <Card className={`${cardShadowClass} shadow-none bg-amber-400 rounded-[2rem] p-6 text-white text-center cursor-pointer`}>
                <div className="bg-white/30 w-12 h-12 rounded-xl flex items-center justify-center text-xl mx-auto mb-3">🗣️</div>
                <p className="font-bold text-lg">Consultation</p>
                <p className="text-xs opacity-70 mt-1 font-medium">Get a mentor to help your learning</p>
             </Card>
             <Card className={`${cardShadowClass} shadow-none bg-[#C94FFF] rounded-[2rem] p-6 text-white text-center cursor-pointer`}>
                <Target size={48} className="mx-auto mb-3 opacity-90"/>
                <p className="font-bold text-lg">Set target</p>
                <p className="text-xs opacity-70 mt-1 font-medium">Set reminders & study timeline</p>
             </Card>
          </div>
        </section>
      </main>
    </div>
  );
}