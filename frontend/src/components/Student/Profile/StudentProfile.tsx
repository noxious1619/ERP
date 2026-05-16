import studentImage from "../../../assets/Student/Dashboard/StudentprofileCard/student.png";
const studentInfo = [
  {
    label: "UID",
    value: "2151651654646651656",
  },
  {
    label: "ADM NO.",
    value: "15500",
  },
  {
    label: "PHONE",
    value: "123456789",
  },
  {
    label: "GENDER",
    value: "Male",
  },
  {
    label: "DOB",
    value: "12-10-2011",
  },
  {
    label: "BLOOD GRP.",
    value: "B +ve",
  },
  {
    label: "AREA",
    value:
      "Block no. 405 Abc resi. krishna park main road, KKV chowk, 150ft ringroad",
  },
  {
    label: "CITY",
    value: "Surat",
  },
  {
    label: "STATE",
    value: "Gujarat",
  },
];

const StudentProfile = () => {
  return (
    <div className="w-[460px] bg-white/40 rounded-3xl shadow-[0px_4px_88px_0px_rgba(0,0,0,0.05)] border-[0.50px] border-stone-300/80 px-12 py-8 backdrop-blur-[2px]">
      {/* Student Image */}
      <div className="flex justify-center">
        <img
          src={studentImage}
          alt="Student"
          className="h-[225px] object-contain"
        />
      </div>

      {/* Name */}
      <h2 className="mt-2 text-center text-[26px] font-black uppercase tracking-[-0.5px] text-black">
        Ojas Sharma
      </h2>

      {/* Class + Roll */}
      <div className="mt-5 flex items-center justify-center gap-12">
        <p className="text-[16px] font-medium text-[#1D1D1D]">Class - 10 A</p>

        <p className="text-[16px] font-medium text-[#1D1D1D]">Roll no- 23</p>
      </div>

      {/* Information */}
      <div className="mt-12 flex flex-col gap-8">
        {studentInfo.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-[82px_1fr] items-start gap-5"
          >
            {/* Label */}
            <span className="text-[13px] font-medium uppercase tracking-[0.5px] text-[#767676]">
              {item.label}
            </span>

            {/* Value */}
            <p className="text-[15px] font-semibold leading-[28px] text-black">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentProfile;
