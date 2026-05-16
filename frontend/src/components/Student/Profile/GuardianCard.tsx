// src/components/Student/Profile/GuardianCard.tsx

const GuardianCard = () => {
  return (
    <div className="w-full rounded-3xl  bg-white/40 px-10 py-4 shadow-[0px_4px_88px_0px_rgba(0,0,0,0.05)] border-[0.50px] border-stone-300/80">
      {/* Heading */}
      <h2 className="text-center text-[34px] font-bold uppercase text-black">
        Guardian
      </h2>

      {/* Details */}
      <div className="mt-8 grid grid-cols-[170px_1fr] gap-y-6">
        {/* Father */}
        <p className="text-[18px] font-medium text-[#9B9B9B]">FATHER</p>
        <p className="text-[20px] font-semibold text-[#2B2B2B]">
          Suresh Sharma
        </p>

        {/* Mobile */}
        <p className="text-[18px] font-medium text-[#9B9B9B]">MOBILE NO.</p>
        <p className="text-[20px] font-semibold text-[#2B2B2B]">123456798</p>

        {/* Mother */}
        <p className="text-[18px] font-medium text-[#9B9B9B]">MOTHER</p>
        <p className="text-[20px] font-semibold text-[#2B2B2B]">Malti Sharma</p>

        {/* Mobile */}
        <p className="text-[18px] font-medium text-[#9B9B9B]">MOBILE NO.</p>
        <p className="text-[20px] font-semibold text-[#2B2B2B]">321654879</p>

        {/* Email */}
        <p className="text-[18px] font-medium text-[#9B9B9B]">EMAIL</p>
        <p className="text-[20px] font-semibold text-[#2B2B2B] truncate ">
          sureshsharma03@gmail.com
        </p>
      </div>
    </div>
  );
};

export default GuardianCard;
