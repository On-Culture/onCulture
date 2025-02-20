import React from "react";
import calendarIcon from "../../assets/calendar_1.5.svg";
import locationIcon from "../../assets/mappin_1.5.svg";
import bookmarkIcon from "../../assets/bookmark_1.svg";
import bookmarkFillIcon from "../../assets/bookmark_1_fill.svg";
import { useNavigate } from "react-router-dom";

interface PerformanceCardProps {
  imageUrl: string;
  title: string;
  date: string;
  location: string;
  isBookmarked: boolean;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  imageUrl,
  title,
  date,
  location,
  isBookmarked,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/infocarddetail");
  };

  return (
    <div
      className="w-[300px] h-[300px] relative overflow-hidden rounded-[10px] bg-white cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full absolute left-0 top-0 object-cover"
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 bottom-0 w-full h-full info-postcard-shadow"></div>
      </div>
      <div className="w-[268px] h-[268px] absolute left-4 top-4">
        <div className="flex justify-between items-start w-full absolute left-0 top-[203px]">
          <div>
            <p className="body-normal-b text-white line-clamp-1">{title}</p>

            <div className="flex items-center w-full mt-1">
              <img
                src={calendarIcon}
                alt="달력 아이콘"
                className="w-3.5 h-3.5 filter invert"
              />
              <p className="caption-r text-white ml-1">{date}</p>
            </div>
            <div className="flex items-center mt-1">
              <img
                src={locationIcon}
                alt="위치 아이콘"
                className="w-3.5 h-3.5 filter invert"
              />
              <p className="caption-r text-white ml-1">{location}</p>
            </div>
          </div>

          <img
            src={isBookmarked ? bookmarkFillIcon : bookmarkIcon}
            alt="북마크 아이콘"
            className={`w-6 h-6 ml-1 cursor-pointer ${isBookmarked ? "" : "filter invert"}`}
          />
        </div>
      </div>
    </div>
  );
};

// 테스트용 더미 데이터
const DummyCard = () => {
  return (
    <PerformanceCard
      imageUrl="info_image.png"
      title="케르종 X 비클린 팝업스토어"
      date="2025.02.14 - 2025.06.30"
      location="경기 성남시"
      isBookmarked={true}
    />
  );
};

export default DummyCard;
