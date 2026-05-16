import ExamCard from "./ExamCard";
import mathsIcon from "../../../assets/Student/Exam/math.svg";
import englishIcon from "../../../assets/Student/Exam/english.png";
import geographyIcon from "../../../assets/Student/Exam/geography.svg";
import chemistryIcon from "../../../assets/Student/Dashboard/YourSubject/chemistry.png";
import biologyIcon from "../../../assets/Student/NoticeBoard/pink.svg";
import physicsIcon from "../../../assets/Student/Exam/physics.png";

const examData = [
  {
    title: "MATHS",
    syllabus:
      "Motion, Force and Laws, Work and Energy, Gravitation, Waves, Electricity",
    date: "17",
    suffix: "th",
    icon: mathsIcon,
    bgColor: "rgba(222, 237, 254, 0.5)",
    iconBg: "#DCEBFF",
  },
  {
    title: "ENGLISH",
    syllabus:
      "Motion, Force and Laws, Work and Energy, Gravitation, Waves, Electricity",
    date: "19",
    suffix: "th",
    icon: englishIcon,
    bgColor: "rgba(255, 226, 232, 0.5)",
    iconBg: "rgba(255, 155, 185, 0.2)",
  },
  {
    title: "GEOGRAPHY",
    syllabus:
      "Motion, Force and Laws, Work and Energy, Gravitation, Waves, Electricity",
    date: "20",
    suffix: "th",
    icon: geographyIcon,
    bgColor: "rgba(222, 237, 254, 0.5)",
    iconBg: "#DCEBFF",
  },
  {
    title: "CHEMISTRY",
    syllabus:
      "Basic Concepts, Atomic Structure, Chemical Bonding Organic Chemistry",
    date: "21",
    suffix: "st",
    icon: chemistryIcon,
    bgColor: "rgba(255, 226, 232, 0.5)",
    iconBg: "rgba(255, 155, 185, 0.2)",
  },
  {
    title: "BIOLOGY",
    syllabus: "Cell Structure, Human Body Systems, Genetics, Plant Physiology",
    date: "22",
    suffix: "nd",
    icon: biologyIcon,
    bgColor: "rgba(222, 237, 254, 0.5)",
    iconBg: "#DCEBFF",
  },
  {
    title: "PHYSICS",
    syllabus:
      "Motion, Force and Laws, Work and Energy, Gravitation, Waves, Electricity",
    date: "23",
    suffix: "rd",
    icon: physicsIcon,
    bgColor: "rgba(255, 226, 232, 0.5)",
    iconBg: "rgba(255, 155, 185, 0.2)",
  },
];

const UpcomingExams = () => {
  return (
    <div className="w-full max-w-[90%] xl:max-w-[95%] 2xl:max-w-full">
      <div className="flex flex-col gap-5">
        {examData.map((exam, index) => (
          <ExamCard key={index} {...exam} />
        ))}
      </div>
    </div>
  );
};

export default UpcomingExams;
