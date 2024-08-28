import { useNavigate } from 'react-router-dom';
import main_location from "../../assets/icons/main_location.png";
import main_top from "../../assets/icons/main_top.png";
import main_new from "../../assets/icons/main_new.png";
import main_category from "../../assets/icons/main_category.png";
import main_event from "../../assets/icons/main_event.png";

const shortcutItem = [
  {
    id: 0,
    title: "내 주변",
    url: main_location,
    link: "/map",  // 내 주변을 클릭했을 때 이동할 주소
  },
  {
    id: 1,
    title: "T.O.P",
    url: main_top,
    link: "/top",  // T.O.P을 클릭했을 때 이동할 주소
  },
  {
    id: 2,
    title: "신상맛집",
    url: main_new,
    link: "/new-restaurants",  // 신상맛집을 클릭했을 때 이동할 주소
  },
  {
    id: 3,
    title: "카테고리",
    url: main_category,
    link: "/category",  // 카테고리를 클릭했을 때 이동할 주소
  },
  {
    id: 4,
    title: "추첨이벤트",
    url: main_event,
    link: "/event-list",  // 추첨이벤트를 클릭했을 때 이동할 주소
  },
];

export default function ShortCut() {
  const navigate = useNavigate();

  return (
    <section className="shorcut-list-wrap pb-[20px] px-[20px] mt-[120px]">
      <div className="shortcut-list">
        {shortcutItem.map((item) => {
          return (
            <button
              className="list-item"
              key={item.id}
              onClick={() => navigate(item.link)}  // 버튼을 클릭했을 때 해당 주소로 이동
            >
              <div className="icon-wrap">
                <img src={item.url} alt={item.title} />
              </div>
              <div className="title">{item.title}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
