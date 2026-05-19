const WeeklyProgressCard = () => {
  return (
    <div
      className="
        flex
        h-84
        w-full
        flex-col
        px-9
        py-8
        bg-white rounded-3xl shadow-[0px_24px_48px_-12px_rgba(110,59,216,0.06)]
      "
    >
      {/* Heading */}
      <h2
        className="
          text-[20px]
          font-bold
          text-[#303030]
        "
      >
        Your Weekly Progress
      </h2>

      {/* Progress Circle */}
      <div className="mt-8 flex justify-center">
        <div className="relative flex h-[140px] w-[140px] items-center justify-center">
          {/* Circular Progress */}
          <div
            className="
              h-[140px]
              w-[140px]
              rounded-full
            "
            style={{
              background: `conic-gradient(
                 #3A71FF 0% 78%,
                #F8F5FF 78% 100%
              )`,
            }}
          >
            {/* Inner Circle */}
            <div
              className="
                absolute
                left-1/2
                top-1/2
                flex
                h-[110px]
                w-[110px]
                -translate-x-1/2
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white
              "
            >
              <span
                className="
                  text-[24px]
                  font-bold
                  text-[#303030]
                "
              >
                78%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-7 text-center">
        <h3
          className="
           text-gray-800 text-md
            font-bold
          "
        >
          14 Tasks Completed
        </h3>

        <p
          className="
            mt-2
           text-zinc-600 text-xs 
            font-medium
            uppercase
            tracking-[1.5px]
          "
        >
          3 TASKS REMAINING THIS WEEK
        </p>
      </div>
    </div>
  );
};

export default WeeklyProgressCard;
