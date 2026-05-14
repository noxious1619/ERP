import biology from "../../../assets/Student/Dashboard/YourSubject/biology.svg";
import chemistry from "../../../assets/Student/Dashboard/YourSubject/chemistry.png";
import geography from "../../../assets/Student/Dashboard/YourSubject/geography.svg";
import english from "../../../assets/Student/Dashboard/YourSubject/english.svg";
import physics from "../../../assets/Student/Dashboard/YourSubject/physics.png";
import maths from "../../../assets/Student/Dashboard/YourSubject/maths.svg";
const subjects = [
  {
    id: 1,
    name: "Maths",
    icon: maths,
    bg: "bg-[#F3F1FF]",
  },
  {
    id: 2,
    name: "English",
    icon: english,
    bg: "bg-[#EEF6FF]",
  },
  {
    id: 3,
    name: "Biology",
    icon: biology,
    bg: "bg-[#FFF0F7]",
  },
  {
    id: 4,
    name: "Geography",
    icon: geography,
    bg: "bg-[#F4F5F7]",
  },
  {
    id: 5,
    name: "Physics",
    icon: physics,
    bg: "bg-[#EEF7FF]",
  },
  {
    id: 6,
    name: "Chemistry",
    icon: chemistry,
    bg: "bg-[#F5F5F5]",
  },
];
const YourSubjects = () => {
  return (
    <div className="mx-auto mt-5">
      {/* Heading */}
      <h2 className="text-[16px] font-bold text-black">Your Subjects</h2>

      {/* Subject Cards */}
      <div className="mt-6 flex items-center gap-4 mb-6 ">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="flex w-40 h-26 px-10 py-4 flex-col items-center justify-center rounded-3xl bg-white shadow-[0px_15px_25px_10px_rgba(0,0,0,0.08)]"
          >
            {/* Icon Circle */}
            <div
              className={`flex w-14 h-14 bg-violet-300/20 items-center justify-center rounded-full ${subject.bg}`}
            >
              <img src={subject.icon} alt={`${subject.name} icon`} />
            </div>

            {/* Subject Name */}
            <h3 className="mt-2 text-[12px] font-bold text-black">
              {subject.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};
export default YourSubjects;
