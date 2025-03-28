import { useNavigate } from "react-router-dom";
import Icon from "../../assets/icons/Icon";
import { useAuthStore } from "../../stores/authStore";
import { useModalStore } from "../../stores/modalStore";
import { useBookmarkState } from "../../hooks/useBookmarkState";
import { useCategoryMapper } from "../../hooks/useInfoCardMapper";
import { useTitleFormatter } from "../../hooks/usePopupTitleFormatter";
import { useDateFormatter } from "../../hooks/useInformationDateFormatter";

interface InformationCardProps {
  id: number;
  date?: string;
  imageUrl: string;
  title: string;
  startDate?: string;
  endDate?: string;
  location: string;
  isBookmarked: boolean;
  onBookmarkChange?: (id: number, newStatus: boolean) => void;
  category: string;
  apiCategory?: string; // 새로 추가된 prop
}

function InformationCard({
  id,
  imageUrl,
  title,
  startDate,
  endDate,
  location,
  isBookmarked,
  onBookmarkChange,
  category,
  apiCategory, // 구조 분해 할당에 추가
}: InformationCardProps) {
  const navigate = useNavigate();
  const { isLoggedIn, checkAuth } = useAuthStore();
  const { openModal } = useModalStore();
  const { mapToApiCategory } = useCategoryMapper();
  const { formatTitle } = useTitleFormatter();
  const { formatDatePeriod } = useDateFormatter();

  // 카테고리에 따라 제목 포맷팅
  const formattedTitle = formatTitle(title, category);

  // 날짜 정보 포맷팅
  const formattedDate = formatDatePeriod(startDate, endDate);

  // 북마크 상태 관리 커스텀 훅 사용
  const {
    isBookmarked: bookmarked,
    toggleBookmark: handleToggleBookmark,
    isLoading,
  } = useBookmarkState(id, isBookmarked);

  // 카드 클릭 시 상세 페이지로 이동
  const handleClick = () => {
    // apiCategory가 있으면 사용, 없으면 mapToApiCategory 함수 사용
    const routeCategory = apiCategory || mapToApiCategory(category);
    navigate(`/informations/${routeCategory}/${id}`);
  };

  // 북마크 토글 처리
  const toggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    // 인증 확인
    await checkAuth();
    if (!isLoggedIn) {
      openModal(
        "로그인이 필요한 서비스입니다.\n 로그인 하러 가시겠어요?",
        "취소하기",
        "로그인하기",
        () => navigate("/login")
      );
      return;
    }

    // apiCategory를 전달하도록 수정
    const result = await handleToggleBookmark(apiCategory);

    // 부모 컴포넌트에 변경 알림
    if (result.success && onBookmarkChange) {
      onBookmarkChange(id, result.newBookmarkStatus);
    }
  };

  return (
    <div
      className="w-[300px] h-[300px] relative overflow-hidden rounded-[10px] bg-white cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={imageUrl}
        alt={formattedTitle}
        className="w-full h-full absolute left-0 top-0 object-cover"
        onError={(e) => {
          console.error(`이미지 로드 실패: ${imageUrl}`);
          e.currentTarget.src = "/default-image.png";
        }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 bottom-0 w-full h-full info-postcard-shadow"></div>
      </div>
      <div className="w-[268px] h-[268px] absolute left-4 top-4">
        <div className="flex justify-between items-start w-full absolute left-0 top-[203px]">
          <div>
            <p className="body-normal-b text-white line-clamp-1">
              {formattedTitle}
            </p>
            <div className="flex items-center w-full mt-1">
              <Icon
                name="CalendarRange"
                size={14}
                strokeWidth={1.5}
                className="text-white"
              />
              <p className="caption-r text-white ml-1">{formattedDate}</p>
            </div>
            <div className="flex items-center mt-1">
              <Icon
                name="MapPin"
                size={14}
                strokeWidth={1.5}
                className="text-white"
              />
              <p className="caption-r text-white ml-1">{location}</p>
            </div>
          </div>
          <button onClick={toggleBookmark} disabled={isLoading}>
            <Icon
              name="Bookmark"
              size={24}
              strokeWidth={1}
              fill={bookmarked ? "white" : "none"}
              className="text-white ml-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default InformationCard;
